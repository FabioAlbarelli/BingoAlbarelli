# Bingo Albarelli

Um jogo de Bingo digital, acessível e mobile-first, desenvolvido com Next.js, Tailwind CSS e Firebase.

## Funcionalidades

- **Criação e Gestão de Salas**: Crie salas privadas e convide familiares.
- **Cartelas Automáticas**: Geração de cartelas 5x5 únicas e aleatórias.
- **Sorteio em Tempo Real**: O host sorteia os números e todos os jogadores veem instantaneamente.
- **Validação de Bingo**: Animação de confete quando alguém completa uma linha, coluna ou diagonal.
- **Acessibilidade**: Interface com alto contraste, botões grandes e fontes legíveis.

## Pré-requisitos

- Node.js 18+ instalado.
- Uma conta no Firebase (para o banco de dados em tempo real).

## Configuração

1.  **Instale as dependências**:
    ```bash
    npm install
    ```

2.  **Configure o Firebase**:
    - Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
    - Crie um Realtime Database.
    - Copie as credenciais do seu projeto.
    - Renomeie o arquivo `.env.local.example` para `.env.local` e preencha com suas credenciais.

3.  **Execute o projeto**:
    ```bash
    npm run dev
    ```
    Acesse `http://localhost:3000`.

## Deploy na Vercel

Este projeto é otimizado para a Vercel.
1.  Faça o push para um repositório Git (GitHub/GitLab).
2.  Importe o projeto na Vercel.
3.  Adicione as variáveis de ambiente do Firebase nas configurações do projeto na Vercel.
4.  Deploy!
