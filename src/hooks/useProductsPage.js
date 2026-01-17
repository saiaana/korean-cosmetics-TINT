import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

import {
  fetchBestsellerProducts,
  fetchOnSaleProducts,
  fetchProductsByBrand,
  fetchProductsByCategory,
  fetchCategories,
  fetchBrands,
  fetchNewProducts,
  selectProductsByList,
  selectListStatus,
  selectListPagination,
  selectCategories,
  selectBrands,
  selectCategoriesStatus,
  selectBrandsStatus,
} from "../store/slices/productsSlice";

import ROUTES from "../constants/routes";
import { createSelector } from "@reduxjs/toolkit";

const EMPTY_ARRAY = [];
const NULL_VALUE = null;
const IDLE_STATUS = "idle";

const emptyArraySelector = createSelector([], () => EMPTY_ARRAY);
const idleStatusSelector = createSelector([], () => IDLE_STATUS);
const nullSelector = createSelector([], () => NULL_VALUE);

const PAGE_CONFIG = {
  promotions: {
    route: ROUTES.promotions,
    listKey: "onSaleProducts",
    fetch: (params) => fetchOnSaleProducts(params),
  },
  bestsellers: {
    route: ROUTES.bestsellers,
    listKey: "bestsellerProducts",
    fetch: (params) => fetchBestsellerProducts(params),
  },
  new: {
    route: ROUTES.newIn,
    listKey: "newProducts",
    fetch: (params) => fetchNewProducts(params),
  },
  byCategory: {
    listKey: "productsByCategory",
    fetch: ({ productsCategory, ...rest }) =>
      productsCategory
        ? fetchProductsByCategory({ category: productsCategory, ...rest })
        : null,
  },
  byBrand: {
    listKey: "productsByBrand",
    fetch: ({ brand, ...rest }) =>
      brand ? fetchProductsByBrand({ brand, ...rest }) : null,
  },
  categories: {
    route: ROUTES.categories,
    fetch: () => fetchCategories(),
  },
  brands: {
    route: ROUTES.brands,
    fetch: () => fetchBrands(),
  },
};

export function useProductsPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { productsCategory, brand } = useParams();

  const paramsKeyRef = useRef(null);

  const pageType = useMemo(() => {
    if (location.pathname === ROUTES.promotions) return "promotions";
    if (location.pathname === ROUTES.bestsellers) return "bestsellers";
    if (location.pathname === ROUTES.newIn) return "new";
    if (location.pathname === ROUTES.categories) return "categories";
    if (location.pathname === ROUTES.brands) return "brands";
    if (productsCategory) return "byCategory";
    if (brand) return "byBrand";
    return null;
  }, [location.pathname, productsCategory, brand]);

  const config = pageType ? PAGE_CONFIG[pageType] : null;

  const productsSelector = useMemo(
    () =>
      config?.listKey
        ? selectProductsByList(config.listKey)
        : emptyArraySelector,
    [config?.listKey],
  );

  const statusSelector = useMemo(
    () =>
      config?.listKey ? selectListStatus(config.listKey) : idleStatusSelector,
    [config?.listKey],
  );

  const paginationSelector = useMemo(
    () =>
      config?.listKey ? selectListPagination(config.listKey) : nullSelector,
    [config?.listKey],
  );

  const products = useSelector(productsSelector);
  const productsStatus = useSelector(statusSelector);
  const pagination = useSelector(paginationSelector);

  const categories = useSelector(selectCategories);
  const brands = useSelector(selectBrands);

  const categoriesStatus = useSelector(selectCategoriesStatus);
  const brandsStatus = useSelector(selectBrandsStatus);

  const status = useMemo(() => {
    if (pageType === "categories") return categoriesStatus;
    if (pageType === "brands") return brandsStatus;
    return productsStatus;
  }, [pageType, categoriesStatus, brandsStatus, productsStatus]);

  const currentParamsKey = `${pageType}-${productsCategory || ""}-${brand || ""}`;

  useEffect(() => {
    if (!config) return;

    const paramsChanged = paramsKeyRef.current !== currentParamsKey;
    const isParamPage = pageType === "byCategory" || pageType === "byBrand";
    const isSimplePage = pageType === "categories" || pageType === "brands";

    const shouldFetch =
      status === "idle" ||
      (isParamPage && paramsChanged && status !== "loading");

    if (!shouldFetch) return;

    const action = isSimplePage
      ? config.fetch()
      : config.fetch({
          productsCategory,
          brand,
          page: 1,
          limit: 12,
          append: false,
        });

    if (action) {
      paramsKeyRef.current = currentParamsKey;
      dispatch(action);
    }
  }, [
    dispatch,
    config,
    status,
    pageType,
    productsCategory,
    brand,
    currentParamsKey,
  ]);

  return {
    products,
    status,
    pagination,
    label: pageType,
    from: location.pathname,
    brands,
    categories,
    categoriesStatus,
    brandsStatus,
  };
}
