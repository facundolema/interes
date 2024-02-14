<script>
	import { onMount } from 'svelte';
	import { readCSV } from '$lib/functions';

	let data = [];
	let startDate = '';
	let endDate = '';
	let interest = 0;
	let amount = 0;

	onMount(async () => {
		try {
			data = await readCSV();
		} catch (error) {
			console.error(error);
		}
	});

	function formatCurrency(value) {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
	}

	function formatDate(dateString) {
		console.log('Date:', dateString);
		const date = new Date(dateString);
		console.log('Date:', date);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
		const year = date.getFullYear();

		return `${day}/${month}/${year}`;
	}

	function calculateInterest() {
		for (let o of data) {
			if (o.FECHA === startDate.replace(/-/g, '')) {
				console.log(o);
				interest = Number(o[formatDate(endDate)]);
				break;
			}
		}
	}
</script>

<main>
	<h1>Calculadora de Interes</h1>

	<div class="container">
		<label for="csv-file">Archivo (.csv)</label>
		<input type="file" accept=".csv" id="csv-file" />
	</div>

	<div class="container">
		<label for="start-date">Desde</label>
		<input type="date" id="start-date" bind:value={startDate} />
	</div>

	<div class="container">
		<label for="end-date">Hasta</label>
		<input type="date" id="end-date" min="2024-01-01" max="2024-01-31" bind:value={endDate} />
	</div>

	<div class="container">
		<label for="amount">Monto</label>
		<input type="number" id="amount" bind:value={amount} />
	</div>

	<button on:click={calculateInterest}>Calcular interés</button>
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
	input {
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
    &, td {
      border: 1px solid #000;
      border-collapse: collapse;
      padding: 2px 6px;
    }
  }
</style>
