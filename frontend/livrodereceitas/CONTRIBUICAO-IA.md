# Guia de Configuração do Projeto Livro de Receitas

Este documento descreve a estrutura, padrões e práticas do projeto **Livro de Receitas** para facilitar a contribuição de agentes de IA e desenvolvedores.

## Estrutura do Projeto

```
IC-LivrodeReceitas/
├── LICENSE
├── README.md
└── frontend/
    ├── README.md
    └── livrodereceitas/
        ├── eslint.config.js
        ├── index.html
        ├── package.json
        ├── package-lock.json (gerado após npm install)
        ├── vite.config.js
        ├── public/
        │   ├── vite.svg
        │   └── assets/
        │       ├── backgroundHero.jpg
        │       ├── logo.png
        │       └── RecipeImage.png
        └── src/
            ├── App.jsx
            ├── index.css
            ├── main.jsx
            ├── components/
            │   ├── FeaturedRecipes/
            │   │   ├── FeaturedRecipes.jsx
            │   │   └── RecipeCard.jsx
            │   ├── Hero/
            │   │   └── Hero.jsx
            │   └── Navbar/
            │       └── Navbar.jsx
            ├── data/
            │   └── sampleRecipes.js
            └── theme/
                └── theme.js
```

## Padrões de Organização

- **Frontend**: Todo o código fonte do frontend está em `frontend/livrodereceitas`.
- **Componentização**: Componentes React organizados por domínio em subpastas de `src/components`.
- **Assets**: Imagens e arquivos estáticos ficam em `public/assets`.
- **Dados de exemplo**: Em `src/data`.
- **Temas**: Em `src/theme`.

## Ferramentas e Configurações

- **Gerenciador de Pacotes**: npm
- **Empacotador**: Vite (`vite.config.js`)
- **Lint**: ESLint (`eslint.config.js`)
- **React**: Projeto principal em React (JSX)

## Padrões de Código

- **JavaScript/JSX**: Usar ES6+ e JSX para componentes React.
- **CSS**: Arquivo global em `src/index.css`. Componentes podem importar estilos próprios.
- **Nomenclatura**: Componentes com PascalCase, arquivos e pastas com camelCase ou kebab-case.
- **Importações Relativas**: Preferir caminhos relativos a partir de `src`.

## Instalação e Execução

1. Navegue até a pasta do frontend:
   ```sh
   cd frontend/livrodereceitas
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Rode o projeto:
   ```sh
   npm run dev
   ```

## Boas Práticas para Contribuição

- Seguir a estrutura de pastas e padrões de nomenclatura.
- Adicionar novos componentes em subpastas de `src/components`.
- Atualizar este guia caso novas práticas sejam adotadas.
- Manter o código limpo e documentado.

## Observações

- O arquivo `package.json` está em `frontend/livrodereceitas`.
- O arquivo `package-lock.json` pode ser gerado após a instalação das dependências.
- O projeto utiliza Vite para desenvolvimento rápido e hot reload.

---

Este guia deve ser atualizado sempre que houver mudanças relevantes na configuração ou padrões do projeto.

