import MealCreate from "./meals/Create.svelte";
import MealEdit from "./meals/Edit.svelte";
import MealIndex from "./meals/Index.svelte";
import NotFound from "./NotFound.svelte";
import PlanCreate from "./plans/Create.svelte";
import SignIn from "./SignIn.svelte";
import SignUp from "./SignUp.svelte";
import Unauthorized from "./Unauthorized.svelte";

export const authRoutes = {
	// plans
	"/plans/create": PlanCreate,
	// meals
	"/meals/create": MealCreate,
	"/meals/:id": MealEdit,
	"/meals": MealIndex,
	// auth
	"/signin": SignIn,
	"/signup": SignUp,
	// root
	"/": MealIndex,
	"*": NotFound,
};

export const noAuthRoutes = {
	"/signin": SignIn,
	"/signup": SignUp,
	"*": Unauthorized,
};
