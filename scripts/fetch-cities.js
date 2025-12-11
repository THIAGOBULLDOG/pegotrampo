import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🌎 Buscando cidades do IBGE...');

https.get('https://servicodados.ibge.gov.br/api/v1/localidades/municipios', (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const municipios = JSON.parse(data);
            console.log(`✅ ${municipios.length} municípios encontrados!`);

            // Group cities by state
            const citiesByState = {};
            const states = new Set();
            let processedCount = 0;

            municipios.forEach((municipio) => {
                // Skip if data is incomplete
                try {
                    const stateCode = municipio?.microrregiao?.mesorregiao?.UF?.sigla;
                    const cityName = municipio?.nome;

                    if (!stateCode || !cityName) {
                        return;
                    }

                    const citySlug = cityName
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '');

                    states.add(stateCode);

                    if (!citiesByState[stateCode]) {
                        citiesByState[stateCode] = [];
                    }

                    citiesByState[stateCode].push({
                        value: citySlug,
                        label: cityName,
                    });

                    processedCount++;
                } catch (err) {
                    // Skip invalid entries
                }
            });

            console.log(`📝 Processadas: ${processedCount} cidades`);

            // Sort cities alphabetically within each state
            Object.keys(citiesByState).forEach((state) => {
                citiesByState[state].sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));
            });

            // Generate TypeScript file
            let tsContent = `// Auto-generated from IBGE data - ${processedCount} municípios brasileiros\n\n`;

            // Brazil states
            tsContent += `export const brazilStates = [\n`;
            const stateNames = {
                AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia',
                CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás',
                MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais',
                PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí',
                RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul',
                RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina', SP: 'São Paulo',
                SE: 'Sergipe', TO: 'Tocantins',
            };

            Array.from(states).sort().forEach((state) => {
                tsContent += `  { value: "${state}", label: "${stateNames[state]}" },\n`;
            });
            tsContent += `];\n\n`;

            // Cities by state
            tsContent += `export const citiesByState: Record<string, { value: string; label: string }[]> = {\n`;
            Object.keys(citiesByState).sort().forEach((state, index, arr) => {
                tsContent += `  ${state}: [\n`;
                citiesByState[state].forEach((city, i, cities) => {
                    tsContent += `    { value: "${city.value}", label: "${city.label}" }${i < cities.length - 1 ? ',' : ''}\n`;
                });
                tsContent += `  ]${index < arr.length - 1 ? ',' : ''}\n`;
            });
            tsContent += `};\n\n`;

            // Job types and salary ranges
            tsContent += `export const jobTypes = [\n`;
            tsContent += `  { value: "todos", label: "Todos os tipos" },\n`;
            tsContent += `  { value: "temporario", label: "Temporário" },\n`;
            tsContent += `  { value: "freelance", label: "Freelance" },\n`;
            tsContent += `  { value: "bico", label: "Bico" },\n`;
            tsContent += `  { value: "diaria", label: "Diária" },\n`;
            tsContent += `];\n\n`;

            tsContent += `export const salaryRanges = [\n`;
            tsContent += `  { value: "", label: "Qualquer valor" },\n`;
            tsContent += `  { value: "50", label: "Acima de R$ 50" },\n`;
            tsContent += `  { value: "100", label: "Acima de R$ 100" },\n`;
            tsContent += `  { value: "200", label: "Acima de R$ 200" },\n`;
            tsContent += `  { value: "500", label: "Acima de R$ 500" },\n`;
            tsContent += `  { value: "1000", label: "Acima de R$ 1.000" },\n`;
            tsContent += `];\n`;

            // Write the file
            const outputPath = path.join(__dirname, '..', 'src', 'data', 'brazilLocations.ts');
            fs.writeFileSync(outputPath, tsContent, 'utf8');

            console.log(`\n📝 Arquivo gerado: ${outputPath}`);
            console.log(`📊 Total de cidades: ${processedCount}`);
            console.log(`📡 Estados: ${states.size}`);
            console.log('\n✨ Concluído com sucesso!');

        } catch (error) {
            console.error('❌ Erro ao processar dados:', error);
            process.exit(1);
        }
    });

}).on('error', (error) => {
    console.error('❌ Erro ao buscar dados do IBGE:', error);
    process.exit(1);
});
