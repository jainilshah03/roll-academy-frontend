const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAllPasswords() {
    try {
        const users = await prisma.user.findMany();

        console.log('\n🔧 Resetting all passwords to "123"...\n');

        // Hash the password "123"
        const hashedPassword = await bcrypt.hash('123', 10);
        console.log(`✅ Generated bcrypt hash for "123": ${hashedPassword.substring(0, 20)}...\n`);

        let updated = 0;

        for (const user of users) {
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });

            console.log(`✅ Updated password for: ${user.email}`);
            updated++;
        }

        console.log(`\n📊 Summary:`);
        console.log(`   Updated: ${updated} users`);
        console.log(`   All users can now login with password: "123"\n`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetAllPasswords();
