const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkUser() {
    try {
        const users = await prisma.user.findMany({
            include: { gym: true },
        });

        console.log('\n📊 Total users:', users.length);

        for (const user of users) {
            console.log('\n👤 User:', {
                id: user.id,
                email: user.email,
                name: user.name,
                gymId: user.gymId,
                gymName: user.gym?.name,
                hasPassword: !!user.password,
                passwordLength: user.password?.length,
            });

            // Test password comparison
            if (user.password) {
                const testPasswords = ['test123', 'password', '123456', 'admin'];
                for (const testPw of testPasswords) {
                    const isValid = await bcrypt.compare(testPw, user.password);
                    if (isValid) {
                        console.log(`  ✅ Password matches: "${testPw}"`);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUser();
