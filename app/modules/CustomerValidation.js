/**
* Customer validation 
*/
class CustomerValidation 
{
    message(data) 
    {
        if (data.email !== undefined) {
            if (data.email.rule === "required") {
                return {
                    'status': 400,
                    'code': 'USR_02',
                    'message': 'The email is required.',
                    'field': 'email'
                }
            } else if (data.email.rule === "email") {
                return {
                    'status': 400,
                    'code': 'USR_03',
                    'message': 'The email is invalid.',
                    'field': data.email.rule
                }
            }
        } else if (data.password !== undefined && 
            data.password.rule === "required") {
            return {
                'status': 400,
                'code': 'USR_02',
                'message': 'The password is required.',
                'field': 'password'
            }
        } else if (data.name !== undefined && 
            data.name.rule === "required") {
            return {
                'status': 400,
                'code': 'USR_02',
                'message': 'The name is required.',
                'field': 'name'
            }
        } else if (data.address_1 !== undefined && 
            data.address_1.rule === "required") {
            return {
                'status': 400,
                'code': 'USR_02',
                'message': 'The address 1 is required.',
                'field': 'address_1'
            }
        } else if (data.city !== undefined && 
            data.city.rule === "required") {
            return {
                'status': 400,
                'code': 'USR_02',
                'message': 'The city is required.',
                'field': 'city'
            }
        } else if (data.region !== undefined && 
            data.region.rule === "required") {
            return {
                'status': 400,
                'code': 'USR_02',
                'message': 'The region is required.',
                'field': 'region'
            }
        } else if (data.postal_code !== undefined && 
            data.postal_code.rule === "required") {
            return {
                'status': 400,
                'code': 'USR_02',
                'message': 'The postal code is required.',
                'field': 'postal_code'
            }
        } else if (data.country !== undefined && 
            data.country.rule === "required") {
            return {
                'status': 400,
                'code': 'USR_02',
                'message': 'The country is required.',
                'field': 'country'
            }
        } else if (data.shipping_region_id !== undefined) {
            if (data.shipping_region_id.rule === "required") {
                return {
                    'status': 400,
                    'code': 'USR_02',
                    'message': 'The shipping region ID is required.',
                    'field': 'shipping_region_id'
                }
            } else if (data.shipping_region_id.rule === "integer") {
                return {
                    'status': 400,
                    'code': 'USR_09',
                    'message': 'The shipping region ID is not number.',
                    'field': 'shipping_region_id'
                }
            }
        } else if (data.credit_card !== undefined) {
            if (data.credit_card.rule === "required") {
                return {
                    'status': 400,
                    'code': 'USR_02',
                    'message': 'The credit card is required.',
                    'field': 'credit_card'
                }
            } else if (data.credit_card.rule === "creditCard") {
                return {
                    'status': 400,
                    'code': 'USR_08',
                    'message': 'This is an invalid credit card.',
                    'field': 'credit_card'
                }
            }
        } else if (data.day_phone !== undefined) {
            if (data.day_phone.rule === "phoneNumber") {
                return {
                    'status': 400,
                    'code': 'USR_06',
                    'message': 'This is an invalid phone number.',
                    'field': 'day_phone'
                }
            }
        } else if (data.eve_phone !== undefined) {
            if (data.eve_phone.rule === "phoneNumber") {
                return {
                    'status': 400,
                    'code': 'USR_06',
                    'message': 'This is an invalid phone number.',
                    'field': 'eve_phone'
                }
            }
        } else if (data.mob_phone !== undefined) {
            if (data.mob_phone.rule === "creditCard") {
                return {
                    'status': 400,
                    'code': 'USR_06',
                    'message': 'This is an invalid phone number.',
                    'field': 'mob_phone'
                }
            }
        }

        return true;
    }
}

module.exports = CustomerValidation;