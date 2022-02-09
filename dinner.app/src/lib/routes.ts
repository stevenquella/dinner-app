import SignUp from "../users/SignUp.svelte";
import SignIn from "../users/SignIn.svelte";
import Unauthorized from "../users/Unauthorized.svelte";
import NotFound from "../components/NotFound.svelte";
import MealIndex from "../meals/Index.svelte";

export const authRoutes = {
	"/meals": MealIndex,
	"/signin": SignIn,
	"/signup": SignUp,
	"*": NotFound,
};

export const noAuthRoutes = {
	"/signin": SignIn,
	"/signup": SignUp,
	"*": Unauthorized,
};
