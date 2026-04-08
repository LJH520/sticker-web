import { generateApi } from 'swagger-typescript-api';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'https://dev-speakami.golingo.cn/api/speakami/doc/v3/api-docs';
// const API_URL = 'http://192.168.110.81:8080/api/speakami/doc/v3/api-docs';
const OUTPUT_DIR = path.resolve(process.cwd(), './api/generated');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function main() {
  console.log('🚀 Starting API generation...');
  console.log('API URL:', API_URL);
  console.log('Output directory:', OUTPUT_DIR);

  try {
    await generateApi({
      url: API_URL,
      name: 'Api.ts',
      output: OUTPUT_DIR,
      httpClientType: 'fetch',
      templates: path.resolve(process.cwd(), './api-templates'),
      generateClient: true,
      generateRouteTypes: true,
      generateResponses: true,
      toJS: false,
      extractRequestParams: true,
      extractRequestBody: true,
      extractEnums: true,
      unwrapResponseData: false,
      prettier: {
        semi: true,
        trailingComma: 'all',
        singleQuote: true,
        printWidth: 100,
        tabWidth: 2,
      },
      defaultResponseAsSuccess: true,
      generateUnionEnums: true,
    });

    console.log('✅ API generated successfully!');
    console.log('\nGenerated files:');
    console.log('  📄 api/generated/Api.ts');
  } catch (error) {
    console.error('\n❌ Error generating API:', error);
    process.exit(1);
  }
}

main();
