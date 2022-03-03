<script lang="ts">
	import type { Plan } from "$providers/_types";
	import { fly, slide } from "svelte/transition";
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
</script>

<div class="flex flex-col gap-2 p-2">
	{#each plans as plan}
		<div class="card card-compact bg-neutral shadow-xl">
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
							<div class="plan-item">
								<a href="#/meals/{meal.id}">{meal.name}</a>
							</div>
						{/each}

						<button class=" plan-item btn border-dotted">Add Meal</button>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>

{#if toggle}
	<div
		transition:fly="{{ y: 300, duration: 300 }}"
		class="flex flex-col  absolute top-0 w-full h-full backdrop-blur-sm">
		<div class="mt-16 border-t bg-neutral flex-grow p-2 shadow-md">
			<p>hello</p>
		</div>
		<button on:click="{() => (toggle = false)}">Toggle</button>
	</div>
{/if}

<style lang="postcss">
	.plan-item {
		@apply border-2 border-accent rounded-md p-2;
	}
</style>
