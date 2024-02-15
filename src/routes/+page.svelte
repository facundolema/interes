<script>
	import { onMount } from 'svelte';
	import { readCSV } from '$lib/functions';

	let data = [];
	let startDate = '';
	let endDate = '';
	let interest = 0;
	let amount = 0;

	onMount(loadData);

	async function loadData() {
		try {
			data = await readCSV();
		} catch (error) {
			console.error(error);
		}
	}

	function formatCurrency(value) {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
	}

	function formatDate(dateString) {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();

		return `${day}/${month}/${year}`;
	}

	function calculateInterest() {
		const formattedEndDate = formatDate(endDate);
		const formattedStartDate = startDate.replace(/-/g, '');

		data.forEach((o) => {
			if (o.FECHA === formattedStartDate) {
				interest = Number(o[formattedEndDate]);
			}
		});
	}
</script>

<main>
	<h1>Calculadora de Interes</h1>

	<div class="container">
		<label for="start-date">Desde</label>
		<input type="date" id="start-date" bind:value={startDate} />

		<label for="end-date">Hasta</label>
		<input type="date" id="end-date" min="2024-01-01" max="2024-01-31" bind:value={endDate} />

		<label for="amount">Monto</label>
		<input type="number" id="amount" bind:value={amount} />

		<button on:click={calculateInterest}>Calcular interés</button>
	</div>

	<table>
		<tr>
			<td>Coeficiente</td>
			<td>{interest}</td>
		</tr>
		<tr>
			<td>Monto actualizado</td>
			<td>{formatCurrency(amount * interest)}</td>
		</tr>
	</table>
</main>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}
	input,
	button {
		margin-bottom: 10px;
		padding: 2px;
		width: 12rem;
		min-width: fit-content;
	}
	label {
		text-transform: uppercase;
		font-weight: bold;
		font-size: smaller;
		color: #444444;
	}
	button {
		width: 12.5rem;
		padding: 5px;
	}
	table {
		margin: 1rem 0;
		width: 50%;
		border: 1px solid #000;
		border-collapse: collapse;
	}
	td {
		padding: 2px 6px;
	}
</style>
