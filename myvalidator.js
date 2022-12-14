function Validator(options){
    let selectorRules = {};
    function validate(inputElement, rule){
        let errorMessage ;
        let errorElement = inputElement.parentElement.querySelector(options.errorSelector)

        
        let rules = selectorRules[rule.selector]
        for (let index = 0; index < rules.length; index++) {
            errorMessage = rules[index](inputElement.value);
            if(errorMessage){
                break;
            }
        }
        if(errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid')
        }else{
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid')
        }

    }
    
    const formElement = document.querySelector(options.form)
    if(formElement){
        formElement.onsubmit = (e)=>{

            if(typeof(options.onSubmit) == 'function'){

                e.preventDefault()
                options.rules.forEach((rule)=>{
                    const inputElement = formElement.querySelector(rule.selector)
                    validate(inputElement, rule)
                })

                let inputEables = document.querySelectorAll('input[name]')
            
                values = Array.from(inputEables).reduce((values, input)=>{
                    // console.log(input)
                    return  (values[input.name] = input.value)  && values
                },{})

                // console.log(values)



                options.onSubmit(values)
                // console.log(document.querySelectorAll('[name]'))
            }

            
                
            
        }
        options.rules.forEach((rule) => {
            const inputElement = formElement.querySelector(rule.selector)
            // console.log(inputElement)
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            }  else {
                selectorRules[rule.selector] = [rule.test];
            }
            
            if(inputElement){
                inputElement.onblur = ()=>{
                    validate(inputElement, rule)  
                }
    
                inputElement.oninput = ()=>{
                    
                    let errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        });
    }else{
        console.log('khong tim thay the?? form')
    }
    // console.log(selectorRules)
}


Validator.isRequired = (selector, message)=>{
    return{
        selector,
        test: (value)=>{
            return value.trim() ? undefined : message||'Vui long nh????p tr??????ng na??y'
        }
    }
}

Validator.isEmail = (selector, message)=>{
    return  {
        selector,
        test: function(value) {
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
            return regex.test(value) ? undefined : message||'Vui l??ng nh???p Email  ????ng ?????nh d???ng';
        }
    };
}

Validator.minLength = (selector, minLength, message)=>{
    return{
        selector,
        test: (value)=>{
            return value.trim() ? undefined : message||`vui lo??ng nh????p ${minLength} ki?? t????`
        }
    }
}


Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'vui long nhap lai truong nay '
        }
    }
}


