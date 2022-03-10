<script lang="ts">
	import { IconCheck, IconChevronRight, IconLoading } from "$components/_Index.svelte";
	import type { Meal, Plan } from "$providers/_types";
	import { fade, fly, slide } from "svelte/transition";
	import { v4 } from "uuid";

	let toggle: boolean = false;
	let itemToggle: boolean = false;
	let filterSelectedToggle = false;

	type MealSelect = Meal & {
		selected: boolean;
	};

	const plans: Plan[] = [
		{
			id: v4(),
			user_id: v4(),
			updated_on: new Date(),
			date: new Date(),
			notes: "",
			meals: [
				{
					id: v4(),
					user_id: v4(),
					name: "test meal",
					groceries: [],
					notes: "",
					tags: [],
					updated_on: new Date(),
				},
				{
					id: v4(),
					user_id: v4(),
					name: "test meal",
					groceries: [],
					notes: "",
					tags: [],
					updated_on: new Date(),
				},
				{
					id: v4(),
					user_id: v4(),
					name: "test meal",
					groceries: [],
					notes: "",
					tags: [],
					updated_on: new Date(),
				},
				{
					id: v4(),
					user_id: v4(),
					name: "test meal",
					groceries: [],
					notes: "",
					tags: [],
					updated_on: new Date(),
				},
				{
					id: v4(),
					user_id: v4(),
					name: "test meal",
					groceries: [],
					notes: "",
					tags: [],
					updated_on: new Date(),
				},
			],
			groceries: [],
		},
		{
			id: v4(),
			user_id: v4(),
			updated_on: new Date(),
			date: new Date(),
			notes: "",
			meals: [],
			groceries: [],
		},
		{
			id: v4(),
			user_id: v4(),
			updated_on: new Date(),
			date: new Date(),
			notes: "",
			meals: [],
			groceries: [],
		},
	];

	const meals: MealSelect[] = [
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
			selected: true,
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
			selected: false,
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
			selected: true,
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
			selected: false,
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
			selected: false,
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
			selected: false,
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
			selected: false,
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
			selected: true,
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
			selected: false,
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
			selected: true,
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
			selected: false,
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
			selected: false,
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
			selected: false,
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
			selected: false,
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
			selected: true,
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
			selected: false,
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
			selected: true,
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
			selected: false,
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
			selected: false,
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
			selected: false,
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
			selected: false,
		},
	];
</script>

<div transition:slide class="flex flex-col gap-2 p-2">
	{#each plans as plan}
		<div class="card card-compact bg-neutral shadow-xl cursor-pointer">
			<div class="card-body">
				<h2 class="card-title" on:click="{() => (itemToggle = !itemToggle)}">
					<span class="flex-grow">{plan.date.toLocaleDateString()}</span>
					<div class="badge badge-secondary cursor-pointer">
						{plan.meals.length} meals
					</div>
				</h2>
				{#if itemToggle}
					<div transition:slide class="flex flex-col gap-2">
						{#each plan.meals as meal}
							<a class="plan-item flex items-center" href="#/meals/{meal.id}">
								<span class="flex-grow">{meal.name}</span>
								<IconChevronRight />
							</a>
						{/each}

						<button
							class=" plan-item btn border-dotted"
							on:click="{() => (toggle = true)}">Edit Meals</button>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>

{#if toggle}
	<div transition:fade class="overlay">
		<div transition:fly="{{ y: 500, duration: 500 }}" class="overlay-content">
			<div class="flex flex-col gap-2 p-2 shadow-">
				<input class="input flex-grow" placeholder="Search meals..." type="text" />
				<button
					on:click="{() => (filterSelectedToggle = !filterSelectedToggle)}"
					class="btn btn-sm btn-outline {filterSelectedToggle ? 'btn-accent' : ''}">
					<IconCheck />
					<span class="ml-2">
						{#if filterSelectedToggle}
							View All
						{:else}
							View Selected
						{/if}
					</span>
				</button>
			</div>

			<div class="flex-grow overflow-scroll flex flex-col gap-2 p-2 border-y">
				<div class="flex flex-col items-center my-3">
					<IconLoading />
				</div>

				{#each meals as meal}
					{#if !filterSelectedToggle || meal.selected}
						<div
							transition:fade
							class="{meal.selected ? 'plan-item text-accent' : 'default-item'}"
							on:click="{() => (meal.selected = !meal.selected)}">
							<span class="flex-grow">{meal.name}</span>
							{#if meal.selected}
								<IconCheck />
							{/if}
						</div>
					{/if}
				{/each}
			</div>

			<div class="flex items-stretch m-2 gap-2">
				<button class="flex-grow btn btn-outline">Close</button>
				<button class="flex-grow btn btn-primary">Save</button>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	.plan-item {
		@apply border-2 border-accent rounded-md p-2 flex items-center;
	}

	.default-item {
		@apply border-2 border-gray-500 rounded-md p-2 flex items-center;
	}

	.overlay {
		@apply absolute top-0 w-full h-full backdrop-blur-sm bg-white bg-opacity-10 flex flex-col items-stretch;
	}

	.overlay-content {
		@apply mt-16 mx-4 rounded-t-md flex-grow bg-neutral flex flex-col items-stretch overflow-auto;
	}
</style>
