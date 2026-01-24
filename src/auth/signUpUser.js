import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { createUser } from "../api/usersApi";
import store from "../store/index.js";
import { setUser } from "../store/slices/authSlice.js";

export async function signUpUser({ email, password, firstName, lastName }) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  await updateProfile(user, {
    displayName: `${firstName} ${lastName}`,
  });

  await user.reload();

  store.dispatch(
    setUser({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    })
  );

  const token = await user.getIdToken();

  await createUser(
    {
      uid: user.uid,
      email,
      firstName,
      lastName,
    },
    token
  );

  return user;
}
