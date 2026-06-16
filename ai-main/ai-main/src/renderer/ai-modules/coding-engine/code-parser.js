/**
 * NEXUS AI - Advanced Code Parser Engine
 * Supports 50+ Programming Languages
 * Designed for 1 Lakh Files + 45 Lakh Lines
 */

class CodeParser {
    constructor() {
        this.languages = this.initializeLanguages();
        this.cache = new Map();
        this.parserConfig = {
            maxCacheSize: 10000,
            parallelProcessing: true,
            chunkSize: 50000,
            timeout: 30000
        };
        this.stats = {
            filesProcessed: 0,
            linesProcessed: 0,
            errorsFound: 0,
            suggestions: 0
        };
    }

    initializeLanguages() {
        return {
            // Web Technologies
            'javascript': { extensions: ['.js', '.mjs', '.cjs'], mode: 'javascript', framework: ['Node.js', 'React', 'Vue', 'Angular', 'Express'] },
            'typescript': { extensions: ['.ts', '.tsx', '.mts'], mode: 'typescript', framework: ['Angular', 'NestJS', 'Deno'] },
            'html': { extensions: ['.html', '.htm', '.xhtml'], mode: 'html', framework: ['Bootstrap', 'Tailwind'] },
            'css': { extensions: ['.css', '.scss', '.sass', '.less'], mode: 'css', framework: ['SASS', 'LESS', 'Tailwind'] },
            'vue': { extensions: ['.vue'], mode: 'html', framework: ['Vue.js'] },
            
            // Backend Languages
            'python': { extensions: ['.py', '.pyw', '.pyx'], mode: 'python', framework: ['Django', 'Flask', 'FastAPI', 'Pyramid', 'Tornado'] },
            'java': { extensions: ['.java'], mode: 'java', framework: ['Spring', 'Hibernate', 'Struts', 'Maven'] },
            'csharp': { extensions: ['.cs'], mode: 'csharp', framework: ['.NET', 'ASP.NET', 'Xamarin', 'Unity'] },
            'cpp': { extensions: ['.cpp', '.cc', '.cxx', '.c++', '.h', '.hpp'], mode: 'cpp', framework: ['Qt', 'Boost', 'STL'] },
            'c': { extensions: ['.c', '.h'], mode: 'c', framework: ['Linux API', 'POSIX'] },
            'go': { extensions: ['.go'], mode: 'go', framework: ['Gin', 'Echo', 'Fiber'] },
            'rust': { extensions: ['.rs'], mode: 'rust', framework: ['Rocket', 'Actix', 'Tokio'] },
            'php': { extensions: ['.php', '.phtml'], mode: 'php', framework: ['Laravel', 'CodeIgniter', 'Symfony', 'WordPress'] },
            'ruby': { extensions: ['.rb', '.rake', '.gemfile'], mode: 'ruby', framework: ['Rails', 'Sinatra', 'Jekyll'] },
            'swift': { extensions: ['.swift'], mode: 'swift', framework: ['SwiftUI', 'UIKit', 'Vapor'] },
            'kotlin': { extensions: ['.kt', '.kts'], mode: 'kotlin', framework: ['Spring', 'Android', 'Ktor'] },
            'scala': { extensions: ['.scala', '.sc'], mode: 'scala', framework: ['Play', 'Spark', 'Akka'] },
            'elixir': { extensions: ['.ex', '.exs'], mode: 'elixir', framework: ['Phoenix', 'Ecto'] },
            'erlang': { extensions: ['.erl', '.hrl'], mode: 'erlang', framework: ['Phoenix', 'Cowboy'] },
            'clojure': { extensions: ['.clj', '.cljs', '.cljc'], mode: 'clojure', framework: ['Compojure', 'Ring'] },
            'haskell': { extensions: ['.hs', '.lhs'], mode: 'haskell', framework: ['Yesod', 'Spock', 'Scotty'] },
            'fsharp': { extensions: ['.fs', '.fsx', '.fsproj'], mode: 'fsharp', framework: ['ASP.NET', 'Fable', 'Suave'] },
            'lua': { extensions: ['.lua'], mode: 'lua', framework: ['LÖVE', 'OpenResty', 'Torch'] },
            'perl': { extensions: ['.pl', '.pm', '.t'], mode: 'perl', framework: ['Mojolicious', 'Dancer', 'Catalyst'] },
            'r': { extensions: ['.r', '.R', '.Rmd'], mode: 'r', framework: ['Shiny', 'ggplot2', 'dplyr'] },
            'matlab': { extensions: ['.m'], mode: 'matlab', framework: ['Simulink'] },
            'julia': { extensions: ['.jl'], mode: 'julia', framework: ['JuMP', 'Flux'] },
            
            // Database & Query
            'sql': { extensions: ['.sql'], mode: 'sql', framework: ['MySQL', 'PostgreSQL', 'Oracle', 'SQLite'] },
            'plsql': { extensions: ['.pls', '.pks', '.pkb'], mode: 'sql', framework: ['Oracle PL/SQL'] },
            'graphql': { extensions: ['.graphql', '.gql'], mode: 'graphql', framework: ['Apollo', 'Relay'] },
            'mongodb': { extensions: ['.js'], mode: 'javascript', framework: ['Mongoose'] },
            
            // Mobile
            'dart': { extensions: ['.dart'], mode: 'dart', framework: ['Flutter', 'Dart'] },
            'objectivec': { extensions: ['.m', '.mm', '.h'], mode: 'objectivec', framework: ['iOS', 'macOS'] },
            'reactnative': { extensions: ['.js', '.jsx', '.ts', '.tsx'], mode: 'javascript', framework: ['React Native'] },
            
            // AI/ML
            'tensorflow': { extensions: ['.py'], mode: 'python', framework: ['TensorFlow', 'Keras'] },
            'pytorch': { extensions: ['.py'], mode: 'python', framework: ['PyTorch', 'FastAI'] },
            'jupyter': { extensions: ['.ipynb'], mode: 'json', framework: ['Jupyter'] },
            
            // DevOps & Cloud
            'dockerfile': { extensions: ['Dockerfile'], mode: 'dockerfile', framework: ['Docker'] },
            'kubernetes': { extensions: ['.yaml', '.yml'], mode: 'yaml', framework: ['K8s', 'Helm'] },
            'terraform': { extensions: ['.tf', '.tfvars'], mode: 'hcl', framework: ['AWS', 'Azure', 'GCP'] },
            'ansible': { extensions: ['.yaml', '.yml'], mode: 'yaml', framework: ['Ansible'] },
            'bash': { extensions: ['.sh', '.bash', '.zsh'], mode: 'shell', framework: ['Bash'] },
            'powershell': { extensions: ['.ps1', '.psm1', '.psd1'], mode: 'powershell', framework: ['PowerShell'] },
            
            // Data Formats
            'json': { extensions: ['.json', '.jsonc'], mode: 'json', framework: [] },
            'xml': { extensions: ['.xml', '.xsl', '.xslt', '.svg'], mode: 'xml', framework: [] },
            'yaml': { extensions: ['.yaml', '.yml'], mode: 'yaml', framework: [] },
            'toml': { extensions: ['.toml'], mode: 'toml', framework: [] },
            'ini': { extensions: ['.ini', '.cfg', '.conf'], mode: 'ini', framework: [] },
            
            // Blockchain
            'solidity': { extensions: ['.sol'], mode: 'solidity', framework: ['Ethereum', 'Web3'] },
            
            // Other
            'markdown': { extensions: ['.md', '.markdown', '.mdown'], mode: 'markdown', framework: [] },
            'latex': { extensions: ['.tex', '.latex'], mode: 'latex', framework: [] },
            'assembly': { extensions: ['.asm', '.s', '.S'], mode: 'assembly', framework: ['x86', 'ARM'] },
            'groovy': { extensions: ['.groovy', '.gradle'], mode: 'groovy', framework: ['Gradle', 'Spock'] },
            'vb': { extensions: ['.vb', '.vbs'], mode: 'vb', framework: ['.NET'] },
            'cobol': { extensions: ['.cbl', '.cob', '.cpy'], mode: 'cobol', framework: ['COBOL'] },
            'fortran': { extensions: ['.f', '.f90', '.f95'], mode: 'fortran', framework: [] },
            'zig': { extensions: ['.zig'], mode: 'zig', framework: [] },
            'nim': { extensions: ['.nim'], mode: 'nim', framework: [] },
            'crystal': { extensions: ['.cr'], mode: 'crystal', framework: ['Amber', 'Kemal'] },
            'v': { extensions: ['.v'], mode: 'v', framework: ['vlang'] },
            'ocaml': { extensions: ['.ml', '.mli'], mode: 'ocaml', framework: ['Jane Street', 'Opium'] },
            'elm': { extensions: ['.elm'], mode: 'elm', framework: ['Elm'] },
            'purescript': { extensions: ['.purs'], mode: 'purescript', framework: [] },
            'idris': { extensions: ['.idr', '.lidr'], mode: 'idris', framework: [] },
            'agda': { extensions: ['.agda'], mode: 'agda', framework: [] },
            'coq': { extensions: ['.v'], mode: 'coq', framework: [] },
            'lean': { extensions: ['.lean'], mode: 'lean', framework: [] }
        };
    }

    // Detect language from file extension
    detectLanguage(filename) {
        const ext = '.' + filename.split('.').pop().toLowerCase();
        for (const [lang, config] of Object.entries(this.languages)) {
            if (config.extensions.includes(ext)) {
                return { language: lang, config: config };
            }
        }
        return null;
    }

    // Parse code file
    async parseFile(content, filename) {
        const detected = this.detectLanguage(filename);
        if (!detected) return { error: 'Unknown file type' };

        const result = {
            language: detected.language,
            filename: filename,
            stats: this.getBasicStats(content),
            analysis: {},
            suggestions: [],
            errors: []
        };

        // Analyze based on language
        switch (detected.language) {
            case 'javascript':
            case 'typescript':
                result.analysis = this.analyzeJSTS(content);
                break;
            case 'python':
                result.analysis = this.analyzePython(content);
                break;
            case 'java':
            case 'csharp':
                result.analysis = this.analyzeOOP(content);
                break;
            case 'cpp':
            case 'c':
                result.analysis = this.analyzeC(content);
                break;
            case 'html':
                result.analysis = this.analyzeHTML(content);
                break;
            case 'css':
                result.analysis = this.analyzeCSS(content);
                break;
            case 'sql':
                result.analysis = this.analyzeSQL(content);
                break;
            case 'json':
                result.analysis = this.analyzeJSON(content);
                break;
            case 'yaml':
                result.analysis = this.analyzeYAML(content);
                break;
            case 'bash':
            case 'powershell':
                result.analysis = this.analyzeShell(content);
                break;
            default:
                result.analysis = this.analyzeGeneric(content);
        }

        this.stats.filesProcessed++;
        this.stats.linesProcessed += result.stats.lines;

        return result;
    }

    getBasicStats(content) {
        const lines = content.split('\n');
        return {
            lines: lines.length,
            characters: content.length,
            bytes: new Blob([content]).size,
            emptyLines: lines.filter(l => l.trim() === '').length,
            commentLines: lines.filter(l => l.trim().startsWith('//') || l.trim().startsWith('#') || l.trim().startsWith('/*')).length,
            codeLines: lines.filter(l => l.trim() !== '' && !l.trim().startsWith('//') && !l.trim().startsWith('#')).length
        };
    }

    analyzeJSTS(content) {
        const analysis = {
            imports: [],
            exports: [],
            classes: [],
            functions: [],
            variables: [],
            interfaces: (content.includes('interface') ? this.extractInterfaces(content) : []),
            types: (content.includes('type ') ? this.extractTypes(content) : []),
            asyncFunctions: [],
            promises: [],
            imports: this.extractImports(content)
        };

        // Extract functions
        const funcRegex = /(?:const|let|var|function|async)?\s*(?:(\w+)\s*[:=]\s*)?(?:\(([^)]*)\)|(\w+)\s*\()/g;
        let match;
        while ((match = funcRegex.exec(content)) !== null) {
            if (match[1] || match[3]) {
                analysis.functions.push({
                    name: match[1] || match[3],
                    params: match[2] || '',
                    async: content.substring(Math.max(0, match.index - 6), match.index).includes('async')
                });
            }
        }

        // Extract classes
        const classRegex = /class\s+(\w+)(?:\s+extends\s+(\w+))?/g;
        while ((match = classRegex.exec(content)) !== null) {
            analysis.classes.push({
                name: match[1],
                extends: match[2] || null
            });
        }

        // Extract async functions
        const asyncRegex = /async\s+(?:function\s+)?(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*async/g;
        while ((match = asyncRegex.exec(content)) !== null) {
            analysis.asyncFunctions.push(match[1] || match[2]);
        }

        return analysis;
    }

    extractImports(content) {
        const imports = [];
        const importRegex = /(?:import|require)\s*(?:\{([^}]+)\}|\*\ as \w+|(\w+))?\s*(?:from\s+)?['"]([^'"]+)['"]/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            imports.push({
                names: match[1] || match[2] || 'default',
                path: match[3]
            });
        }
        return imports;
    }

    extractInterfaces(content) {
        const interfaces = [];
        const interfaceRegex = /interface\s+(\w+)(?:\s*extends\s+([^{]+))?\s*\{([^}]+)\}/g;
        let match;
        while ((match = interfaceRegex.exec(content)) !== null) {
            interfaces.push({
                name: match[1],
                extends: match[2] || null,
                properties: match[3].split(';').filter(p => p.trim())
            });
        }
        return interfaces;
    }

    extractTypes(content) {
        const types = [];
        const typeRegex = /type\s+(\w+)\s*=\s*([^{]+)/g;
        let match;
        while ((match = typeRegex.exec(content)) !== null) {
            types.push({
                name: match[1],
                definition: match[2]
            });
        }
        return types;
    }

    analyzePython(content) {
        const analysis = {
            imports: [],
            classes: [],
            functions: [],
            asyncFunctions: [],
            decorators: [],
            variables: [],
            types: []
        };

        // Extract imports
        const importRegex = /(?:import|from)\s+([\w.]+)(?:\s+import\s+([^{]+))?/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            analysis.imports.push({
                module: match[1],
                items: match[2] ? match[2].split(',').map(i => i.trim()) : []
            });
        }

        // Extract classes
        const classRegex = /class\s+(\w+)(?:\([^)]+\))?:/g;
        while ((match = classRegex.exec(content)) !== null) {
            analysis.classes.push(match[1]);
        }

        // Extract functions
        const funcRegex = /(?:def|async\s+def)\s+(\w+)\s*\(([^)]*)\)/g;
        while ((match = funcRegex.exec(content)) !== null) {
            analysis.functions.push({
                name: match[1],
                params: match[2],
                async: match[0].includes('async')
            });
            if (match[0].includes('async')) {
                analysis.asyncFunctions.push(match[1]);
            }
        }

        // Extract decorators
        const decoratorRegex = /@(\w+)/g;
        while ((match = decoratorRegex.exec(content)) !== null) {
            analysis.decorators.push(match[1]);
        }

        return analysis;
    }

    analyzeOOP(content) {
        const analysis = {
            namespaces: [],
            classes: [],
            interfaces: [],
            methods: [],
            properties: [],
            usingStatements: []
        };

        // Java/C# patterns
        const classRegex = /(?:public|private|protected)?\s*(?:static)?\s*class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([^{]+))?/g;
        let match;
        while ((match = classRegex.exec(content)) !== null) {
            analysis.classes.push({
                name: match[1],
                extends: match[2] || null,
                implements: match[3] ? match[3].split(',').map(i => i.trim()) : []
            });
        }

        // Methods
        const methodRegex = /(?:public|private|protected)?\s*(?:static)?\s*(?:\w+(?:<[^>]+>)?)\s+(\w+)\s*\(([^)]*)\)/g;
        while ((match = methodRegex.exec(content)) !== null) {
            if (match[1] !== 'if' && match[1] !== 'for' && match[1] !== 'while') {
                analysis.methods.push({
                    name: match[1],
                    params: match[2]
                });
            }
        }

        return analysis;
    }

    analyzeC(content) {
        const analysis = {
            includes: [],
            defines: [],
            structs: [],
            functions: [],
            globalVariables: [],
            enums: []
        };

        // Includes
        const includeRegex = /#include\s*[<"]([^>"]+)[>"]/g;
        let match;
        while ((match = includeRegex.exec(content)) !== null) {
            analysis.includes.push(match[1]);
        }

        // Defines
        const defineRegex = /#define\s+(\w+)(?:\s+(.+))?/g;
        while ((match = defineRegex.exec(content)) !== null) {
            analysis.defines.push({
                name: match[1],
                value: match[2] || ''
            });
        }

        // Structs
        const structRegex = /struct\s+(\w+)(?:\s*\{)?/g;
        while ((match = structRegex.exec(content)) !== null) {
            analysis.structs.push(match[1]);
        }

        // Functions
        const funcRegex = /(?:void|int|char|float|double|long|short|struct\s+\w+)\s*(\w+)\s*\(([^)]*)\)/g;
        while ((match = funcRegex.exec(content)) !== null) {
            analysis.functions.push({
                name: match[1],
                params: match[2]
            });
        }

        return analysis;
    }

    analyzeHTML(content) {
        const analysis = {
            doctype: '',
            htmlVersion: '',
            headElements: [],
            bodyElements: [],
            scripts: [],
            styles: [],
            metaTags: [],
            links: []
        };

        // Doctype
        const doctypeRegex = /<!DOCTYPE\s+([^>]+)>/i;
        const doctypeMatch = content.match(doctypeRegex);
        if (doctypeMatch) {
            analysis.doctype = doctypeMatch[1];
        }

        // Head elements
        const headRegex = /<head[^>]*>([\s\S]*?)<\/head>/i;
        const headMatch = content.match(headRegex);
        if (headMatch) {
            const metaRegex = /<meta\s+([^>]+)>/gi;
            let match;
            while ((match = metaRegex.exec(headMatch[1])) !== null) {
                analysis.metaTags.push(match[1]);
            }
        }

        // Scripts
        const scriptRegex = /<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi;
        let match;
        while ((match = scriptRegex.exec(content)) !== null) {
            analysis.scripts.push({
                src: match[0].match(/src=["']([^"']+)["']/)?.[1] || 'inline',
                inline: !match[0].includes('src=')
            });
        }

        // Links
        const linkRegex = /<link\s+([^>]+)>/gi;
        while ((match = linkRegex.exec(content)) !== null) {
            analysis.links.push(match[1]);
        }

        return analysis;
    }

    analyzeCSS(content) {
        const analysis = {
            selectors: [],
            mediaQueries: [],
            keyframes: [],
            variables: [],
            mixins: []
        };

        // Selectors
        const selectorRegex = /([.#]?[\w-]+)\s*\{/g;
        let match;
        while ((match = selectorRegex.exec(content)) !== null) {
            analysis.selectors.push(match[1]);
        }

        // Media queries
        const mediaRegex = /@media\s+([^{]+)\s*\{/g;
        while ((match = mediaRegex.exec(content)) !== null) {
            analysis.mediaQueries.push(match[1]);
        }

        // Keyframes
        const keyframeRegex = /@keyframes\s+(\w+)/g;
        while ((match = keyframeRegex.exec(content)) !== null) {
            analysis.keyframes.push(match[1]);
        }

        // CSS Variables
        const varRegex = /--([\w-]+)\s*:/g;
        while ((match = varRegex.exec(content)) !== null) {
            analysis.variables.push(match[1]);
        }

        return analysis;
    }

    analyzeSQL(content) {
        const analysis = {
            tables: [],
            views: [],
            storedProcedures: [],
            triggers: [],
            indexes: [],
            queries: []
        };

        // Tables
        const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?(\w+)[`"]?/gi;
        let match;
        while ((match = tableRegex.exec(content)) !== null) {
            analysis.tables.push(match[1]);
        }

        // Views
        const viewRegex = /CREATE\s+(?:OR\s+REPLACE\s+)?VIEW\s+[`"]?(\w+)[`"]?/gi;
        while ((match = viewRegex.exec(content)) !== null) {
            analysis.views.push(match[1]);
        }

        // Indexes
        const indexRegex = /CREATE\s+(?:UNIQUE\s+)?INDEX\s+[`"]?(\w+)[`"]?/gi;
        while ((match = indexRegex.exec(content)) !== null) {
            analysis.indexes.push(match[1]);
        }

        // Queries
        const queryTypes = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'ALTER', 'DROP'];
        for (const qtype of queryTypes) {
            const count = (content.match(new RegExp(qtype, 'gi')) || []).length;
            if (count > 0) {
                analysis.queries.push({ type: qtype, count: count });
            }
        }

        return analysis;
    }

    analyzeJSON(content) {
        try {
            const parsed = JSON.parse(content);
            return {
                valid: true,
                keys: Object.keys(parsed),
                nested: this.countNestedLevels(parsed),
                size: content.length
            };
        } catch (e) {
            return { valid: false, error: e.message };
        }
    }

    countNestedLevels(obj, level = 0) {
        if (typeof obj !== 'object' || obj === null) return level;
        const values = Object.values(obj);
        if (values.length === 0) return level;
        return Math.max(...values.map(v => this.countNestedLevels(v, level + 1)));
    }

    analyzeYAML(content) {
        const analysis = {
            documents: 0,
            keys: [],
            arrays: 0,
            nested: 0
        };

        analysis.documents = (content.match(/^---/gm) || []).length + 1;
        
        const keyRegex = /^(\w+):/gm;
        let match;
        while ((match = keyRegex.exec(content)) !== null) {
            analysis.keys.push(match[1]);
        }

        analysis.arrays = (content.match(/^\s*-\s+/gm) || []).length;
        analysis.nested = content.split('\n').reduce((max, line) => {
            const indent = line.search(/\S/);
            return Math.max(max, indent);
        }, 0);

        return analysis;
    }

    analyzeShell(content) {
        const analysis = {
            shebang: '',
            variables: [],
            functions: [],
            commands: [],
            conditionals: [],
            loops: []
        };

        // Shebang
        const shebangMatch = content.match(/^#!\/[^\s]+/);
        if (shebangMatch) {
            analysis.shebang = shebangMatch[0];
        }

        // Variables
        const varRegex = /(\w+)=["']?[^"'\n]+["']?/g;
        let match;
        while ((match = varRegex.exec(content)) !== null) {
            analysis.variables.push(match[1]);
        }

        // Functions
        const funcRegex = /(?:function\s+)?(\w+)\s*\(\)\s*\{/g;
        while ((match = funcRegex.exec(content)) !== null) {
            analysis.functions.push(match[1]);
        }

        // Common commands
        const commonCommands = ['echo', 'grep', 'sed', 'awk', 'curl', 'wget', 'git', 'npm', 'docker', 'kubectl'];
        for (const cmd of commonCommands) {
            if (content.includes(cmd)) {
                analysis.commands.push(cmd);
            }
        }

        return analysis;
    }

    analyzeGeneric(content) {
        return {
            basic: true,
            lines: content.split('\n').length,
            characters: content.length
        };
    }

    // Get statistics
    getStats() {
        return this.stats;
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }
}

// Export
window.CodeParser = CodeParser;
