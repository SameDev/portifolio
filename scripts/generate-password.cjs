#!/usr/bin/env node

/**
 * Script para gerar hash de senha usando bcrypt
 *
 * Uso:
 * node scripts/generate-password.js
 * ou
 * node scripts/generate-password.cjs "minha-senha"
 */

const bcrypt = require("bcrypt");
const readline = require("readline");

const SALT_ROUNDS = 10;

async function generatePasswordHash(password) {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  } catch (error) {
    console.error("Erro ao gerar hash:", error.message);
    process.exit(1);
  }
}

async function main() {
  // Verifica se a senha foi passada como argumento
  if (process.argv[2]) {
    const password = process.argv[2];
    const hash = await generatePasswordHash(password);

    console.log("\n" + "=".repeat(60));
    console.log("✅ Hash gerado com sucesso!");
    console.log("=".repeat(60));
    console.log("\n📝 Senha original:", password);
    console.log("🔐 Hash gerado:\n");
    console.log(hash);
    console.log("\n" + "=".repeat(60));
    console.log("\n💡 Para atualizar no banco de dados, execute:");
    console.log(
      '\nUPDATE "User" SET password = \'' +
        hash +
        "' WHERE email = 'seu-email@exemplo.com';",
    );
    console.log("\n" + "=".repeat(60) + "\n");
  } else {
    // Modo interativo
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("\n" + "=".repeat(60));
    console.log("🔐 Gerador de Hash de Senha - Bcrypt");
    console.log("=".repeat(60) + "\n");

    rl.question(
      "Digite a senha que deseja gerar o hash: ",
      async (password) => {
        if (!password || password.trim() === "") {
          console.error("\n❌ Erro: Senha não pode estar vazia!");
          rl.close();
          process.exit(1);
        }

        const hash = await generatePasswordHash(password);

        console.log("\n" + "=".repeat(60));
        console.log("✅ Hash gerado com sucesso!");
        console.log("=".repeat(60));
        console.log("\n📝 Senha original:", password);
        console.log("🔐 Hash gerado:\n");
        console.log(hash);
        console.log("\n" + "=".repeat(60));
        console.log("\n💡 Para atualizar no banco de dados, execute:");
        console.log(
          '\nUPDATE "User" SET password = \'' +
            hash +
            "' WHERE email = 'seu-email@exemplo.com';",
        );
        console.log("\n" + "=".repeat(60) + "\n");

        rl.close();
      },
    );
  }
}

main();
