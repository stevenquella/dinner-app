<script lang="ts">
	import { IconChevronRight, IconLoading, IconX } from "$components/_Index.svelte";
	import type { Meal, Plan } from "$providers/_types";
	import { fade, fly, slide } from "svelte/transition";
	import { v4 } from "uuid";

	let toggle: boolean = false;
	let itemToggle: boolean = false;

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

	const meals: Meal[] = [
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
		},
		{
			id: v4(),
			name: "test meal",
			notes: "",
			groceries: [],
			tags: [],
			updated_on: new Date(),
			user_id: v4(),
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
							on:click="{() => (toggle = true)}">Add Meal</button>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>

{#if toggle}
	<div
		transition:fade
		class="absolute top-0 w-full h-full backdrop-blur-sm bg-white bg-opacity-10 flex flex-col items-stretch">
		<div
			transition:fly="{{ y: 500, duration: 500 }}"
			class="mt-16 mx-4 md:mx-16 rounded-t-md flex-grow bg-neutral flex flex-col items-stretch">
			<div class="flex items-center">
				<h3 class="flex-grow text-lg">Edit Meals</h3>
				<button class="btn" on:click="{() => (toggle = false)}"><IconX /></button>
			</div>

			<IconLoading />
			{#each meals as meal}
				<div class="plan-item">{meal.name}</div>
			{/each}
		</div>
	</div>
{/if}

<style lang="postcss">
	.plan-item {
		@apply border-2 border-accent rounded-md p-2;
	}
</style>
