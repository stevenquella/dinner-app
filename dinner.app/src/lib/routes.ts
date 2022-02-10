import SignUp from "../users/SignUp.svelte";
import SignIn from "../users/SignIn.svelte";
import Unauthorized from "../users/Unauthorized.svelte";
import NotFound from "../components/NotFound.svelte";
import MealIndex from "../meals/Index.svelte";
import MealEdit from "../meals/Edit.svelte";
import MealCreate from "../meals/Create.svelte";

export const authRoutes = {
	"/meals/create": MealCreate,
	"/meals/:id": MealEdit,
	"/meals": MealIndex,
	"/signin": SignIn,
	"/signup": SignUp,
	"*": MealIndex,
};

export const noAuthRoutes = {
	"/signin": SignIn,
	"/signup": SignUp,
	"*": Unauthorized,
};
