const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixPasswords() {
    try {
        const users = await prisma.user.findMany();

        console.log('\n🔧 Starting password migration...\n');

        let fixed = 0;
        let alreadyHashed = 0;

        for (const user of users) {
            const isBcryptHash = user.password?.startsWith('$2a$') ||
                user.password?.startsWith('$2b$') ||
                user.password?.startsWith('$2y$');

            if (!isBcryptHash && user.password) {
                console.log(`❌ ${user.email} - Plain text password detected`);
                console.log(`   Original: "${user.password}"`);

                // Hash the plain text password
                const hashedPassword = await bcrypt.hash(user.password, 10);

                // Update the user
                await prisma.user.update({
                    where: { id: user.id },
                    data: { password: hashedPassword },
                });

                console.log(`   ✅ Updated to bcrypt hash (length: ${hashedPassword.length})\n`);
                fixed++;
            } else {
                console.log(`✅ ${user.email} - Already properly hashed\n`);
                alreadyHashed++;
            }
        }

        console.log('\n📊 Summary:');
        console.log(`   Fixed: ${fixed} users`);
        console.log(`   Already hashed: ${alreadyHashed} users`);
        console.log(`   Total: ${fixed + alreadyHashed} users\n`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixPasswords();
