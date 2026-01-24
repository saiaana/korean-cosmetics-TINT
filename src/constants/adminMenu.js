import { ROLE_PERMISSIONS } from "./roles";


export const ADMIN_MENU_ITEMS = [
  {
    title: "Orders Management",
    description: "View and manage all customer orders",
    link: "/admin/orders",
    icon: "📦",
    color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
    allowedRoles: ROLE_PERMISSIONS.ORDERS_MANAGEMENT,
  },
  {
    title: "Statistics",
    description: "View sales and performance analytics",
    link: "/admin/stats",
    icon: "📊",
    color: "bg-green-50 hover:bg-green-100 border-green-200",
    allowedRoles: ROLE_PERMISSIONS.STATISTICS,
  },
  {
    title: "Add Product",
    description: "Create a new product in the catalog",
    link: "/admin/products/add",
    icon: "➕",
    color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
    allowedRoles: ROLE_PERMISSIONS.ADD_PRODUCT,
  },
  {
    title: "Products Management",
    description: "View and manage all products in the catalog",
    link: "/admin/products",
    icon: "🛒",
    color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
    allowedRoles: ROLE_PERMISSIONS.PRODUCTS_MANAGEMENT,
  },
];

export function getAdminMenuItemsForRole(userRole) {
  return ADMIN_MENU_ITEMS.filter((item) =>
    item.allowedRoles.includes(userRole)
  );
}
