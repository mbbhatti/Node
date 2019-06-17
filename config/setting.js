var config = {
    local: {
        mode: 'local',
        port: 3000,
        mongo: {

        },
        mysql: {
            host: '127.0.0.1',
            db: 'turing',
            port: '3306',
            user: 'root',
            password: ''
        },
        mail: {
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: '965428ed000225',
                pass: '703082e1973f6a'
            }
        },
        admin: {
            name: 'admin',
            email: 'admin@turing.com'
        }
    },
    staging: {
        mode: 'staging',
    },
    production: {
        mode: 'production'
    }
}
module.exports = function(mode) {
    return config[mode || 'local'] || config.local;
}