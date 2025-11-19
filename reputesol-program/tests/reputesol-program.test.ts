import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ReputesolProgram } from "../target/types/reputesol_program";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { assert, expect } from "chai";
import * as fs from "fs";

describe("ReputeSol Program Tests", () => {
  // Configure the client to use devnet
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.ReputesolProgram as Program<ReputesolProgram>;

  // Load the test user keypair
  const testUserKeypairData = JSON.parse(
    fs.readFileSync("test-user.json", "utf-8")
  );
  const testUser = Keypair.fromSecretKey(new Uint8Array(testUserKeypairData));

  // Load the real authority keypair
  const authorityKeypairData = JSON.parse(
    fs.readFileSync("../reputesol-authority.json", "utf-8")
  );
  const authority = Keypair.fromSecretKey(new Uint8Array(authorityKeypairData));

  // PDA for test user
  let userPDA: PublicKey;
  let userBump: number;

  before(async () => {
    console.log("\n⚠️  AIRDROP NEEDED:");
    console.log("Test User Wallet:", testUser.publicKey.toString());
    console.log("Waiting 60 seconds for airdrop...\n");

    // Wait for manual airdrop
    await new Promise(resolve => setTimeout(resolve, 60000));

    // Derive PDA for test user
    [userPDA, userBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("user"), testUser.publicKey.toBuffer()],
      program.programId
    );
  });

  describe("Initialize User", () => {
    it("Successfully initializes a new user account", async () => {
      const tx = await program.methods
        .initializeUser()
        .accounts({
          userAccount: userPDA,
          owner: testUser.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([testUser])
        .rpc();

      // Fetch the created account
      const userAccount = await program.account.userAccount.fetch(userPDA);

      // Verify account data
      assert.equal(
        userAccount.owner.toString(),
        testUser.publicKey.toString(),
        "Owner mismatch"
      );
      assert.equal(
        userAccount.totalScore.toNumber(),
        0,
        "Initial total score should be 0"
      );
      assert.equal(
        userAccount.gitcoinScore,
        0,
        "Initial Gitcoin score should be 0"
      );
      assert.equal(
        userAccount.solanaScore,
        0,
        "Initial Solana score should be 0"
      );
      assert.equal(userAccount.bump, userBump, "Bump mismatch");
    });

    it("Fails to initialize the same user twice", async () => {
      try {
        await program.methods
          .initializeUser()
          .accounts({
            userAccount: userPDA,
            owner: testUser.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([testUser])
          .rpc();

        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.ok(error, "Expected an error");
      }
    });
  });

  describe("Update Score", () => {
    it("Successfully updates score with valid data", async () => {
      const gitcoinScore = 75;
      const solanaScore = 60;
      const expectedTotal = gitcoinScore * 50 + solanaScore * 50; // 50% each

      const tx = await program.methods
        .updateScore(gitcoinScore, solanaScore)
        .accounts({
          userAccount: userPDA,
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc();

      // Fetch updated account
      const userAccount = await program.account.userAccount.fetch(userPDA);

      assert.equal(
        userAccount.gitcoinScore,
        gitcoinScore,
        "Gitcoin score mismatch"
      );
      assert.equal(
        userAccount.solanaScore,
        solanaScore,
        "Solana score mismatch"
      );
      assert.equal(
        userAccount.totalScore.toNumber(),
        expectedTotal,
        "Total score calculation incorrect"
      );
    });

    it("Updates score multiple times correctly", async () => {

      // Update 1
      await program.methods
        .updateScore(80, 70)
        .accounts({
          userAccount: userPDA,
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc();

      let userAccount = await program.account.userAccount.fetch(userPDA);
      assert.equal(userAccount.gitcoinScore, 80);
      assert.equal(userAccount.solanaScore, 70);

      // Update 2
      await program.methods
        .updateScore(90, 85)
        .accounts({
          userAccount: userPDA,
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc();

      userAccount = await program.account.userAccount.fetch(userPDA);
      assert.equal(userAccount.gitcoinScore, 90);
      assert.equal(userAccount.solanaScore, 85);
    });

    it("Correctly handles edge case: all zeros", async () => {

      await program.methods
        .updateScore(0, 0)
        .accounts({
          userAccount: userPDA,
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc();

      const userAccount = await program.account.userAccount.fetch(userPDA);
      assert.equal(userAccount.gitcoinScore, 0);
      assert.equal(userAccount.solanaScore, 0);
      assert.equal(userAccount.totalScore.toNumber(), 0);

    });

    it("Correctly handles edge case: maximum scores", async () => {

      await program.methods
        .updateScore(100, 100)
        .accounts({
          userAccount: userPDA,
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc();

      const userAccount = await program.account.userAccount.fetch(userPDA);
      assert.equal(userAccount.gitcoinScore, 100);
      assert.equal(userAccount.solanaScore, 100);
      assert.equal(userAccount.totalScore.toNumber(), 10000);

    });
  });

  describe("Authorization & Security", () => {
    it("Fails when unauthorized user tries to update score", async () => {

      const unauthorizedUser = Keypair.generate();

      // Airdrop for transaction fee
      const sig = await provider.connection.requestAirdrop(
        unauthorizedUser.publicKey,
        anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(sig);

      try {
        await program.methods
          .updateScore(50, 50)
          .accounts({
            userAccount: userPDA,
            authority: unauthorizedUser.publicKey,
          })
          .signers([unauthorizedUser])
          .rpc();

        assert.fail("Should have thrown unauthorized error");
      } catch (error: any) {
        assert.include(
          error.toString(),
          "Unauthorized",
          "Should return Unauthorized error"
        );
      }
    });
  });

  describe("Input Validation", () => {
    it("Fails with invalid Gitcoin score (> 100)", async () => {
      console.log("\n📝 Test: Invalid Gitcoin Score");

      try {
        await program.methods
          .updateScore(150, 50) // Invalid: 150 > 100
          .accounts({
            userAccount: userPDA,
            authority: authority.publicKey,
          })
          .signers([authority])
          .rpc();

        assert.fail("Should have thrown validation error");
      } catch (error: any) {
        console.log("  ✅ Correctly rejected invalid Gitcoin score (150)");
        assert.include(
          error.toString(),
          "InvalidScore",
          "Should return InvalidScore error"
        );
      }
    });

    it("Fails with invalid Solana score (> 100)", async () => {
      console.log("\n📝 Test: Invalid Solana Score");

      try {
        await program.methods
          .updateScore(50, 200) // Invalid: 200 > 100
          .accounts({
            userAccount: userPDA,
            authority: authority.publicKey,
          })
          .signers([authority])
          .rpc();

        assert.fail("Should have thrown validation error");
      } catch (error: any) {
        console.log("  ✅ Correctly rejected invalid Solana score (200)");
        assert.include(
          error.toString(),
          "InvalidScore",
          "Should return InvalidScore error"
        );
      }
    });
  });

  describe("Score Calculation Logic", () => {
    it("Verifies weighted scoring formula", async () => {
      console.log("\n📝 Test: Weighted Scoring Formula");

      const testCases = [
        { gitcoin: 50, solana: 50, expected: 5000 },
        { gitcoin: 100, solana: 0, expected: 5000 },
        { gitcoin: 0, solana: 100, expected: 5000 },
        { gitcoin: 75, solana: 25, expected: 5000 },
        { gitcoin: 60, solana: 80, expected: 7000 },
      ];

      for (const testCase of testCases) {
        await program.methods
          .updateScore(testCase.gitcoin, testCase.solana)
          .accounts({
            userAccount: userPDA,
            authority: authority.publicKey,
          })
          .signers([authority])
          .rpc();

        const userAccount = await program.account.userAccount.fetch(userPDA);
        assert.equal(
          userAccount.totalScore.toNumber(),
          testCase.expected,
          `Score calculation wrong for G=${testCase.gitcoin}, S=${testCase.solana}`
        );

        console.log(
          `  ✅ G=${testCase.gitcoin}, S=${testCase.solana} → Total=${testCase.expected}`
        );
      }
    });
  });

  after(() => {
    console.log("\n✅ All tests completed!");
  });
});
