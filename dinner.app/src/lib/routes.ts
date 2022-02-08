import SignUp from "../users/SignUp.svelte";
import SignIn from "../users/SignIn.svelte";
import Unauthorized from "../users/Unauthorized.svelte";
import NotFound from "../components/NotFound.svelte";

export const authRoutes = {
	"/signin": SignIn,
	"/signup": SignUp,
	"*": NotFound,
};

export const noAuthRoutes = {
	"/signin": SignIn,
	"/signup": SignUp,
	"*": Unauthorized,
};
