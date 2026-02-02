const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testBcryptHashes() {
    try {
        const users = await prisma.user.findMany({
            include: { gym: true },
        });

        console.log('\n🔍 Analyzing password hashes...\n');

        for (const user of users) {
            const passwordLength = user.password?.length || 0;
            const isBcryptHash = user.password?.startsWith('$2a$') || user.password?.startsWith('$2b$') || user.password?.startsWith('$2y$');

            console.log(`📧 ${user.email}`);
            console.log(`   Length: ${passwordLength}`);
            console.log(`   Is bcrypt hash: ${isBcryptHash ? '✅' : '❌'}`);
            console.log(`   Gym: ${user.gym?.name}`);

            if (!isBcryptHash && user.password) {
                console.log(`   ⚠️  PLAIN TEXT PASSWORD DETECTED: "${user.password}"`);

                // Try to hash it properly
                const hashedPassword = await bcrypt.hash(user.password, 10);
                console.log(`   🔧 Suggested fix: Update to hashed version (length: ${hashedPassword.length})`);
            }
            console.log('');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testBcryptHashes();
