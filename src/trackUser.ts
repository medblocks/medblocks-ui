import type { firebaseUser } from "./firebase"
import {mixpanel} from "./mixpanel"
declare var FS: any

export function track(user: firebaseUser) {
    FS.identify(user.uid, {
        displayName: user.displayName,
        email: user.email
    })
    mixpanel.identify(user.uid)
    mixpanel.people.set({
        "$email": user.email,
        "USER_ID": user.uid,
      });
    mixpanel.track("Login")
}