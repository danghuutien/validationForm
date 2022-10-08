//Object Constructer
function Validator (options) {

    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage = rule.test(inputElement.value);
        var rules = selectorRules[rules.selector];
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }               
    }
    
    //Lấy element của form cần validate 
    var formElement = document.querySelector(options.form);

    if(formElement) {
        options.rules.forEach( function (rule) {
            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rules.selector])) {
                selectorRules[rule.selector].push(rule.test);
            }  else {
                selectorRules[rules.selector] = [rules.test];
            }
            var inputElement = formElement.querySelector(rule.selector);
           // Xử lí trường hợp khi người dùng blur ra khỏi input
            if (inputElement) {
               inputElement.onblur = function() {
                    validate(inputElement, rule);
               }
            }
            // Xử lí trường hợp khi người dùng nhập tiếp 
            inputElement.oninput = function() {
                var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                errorElement.innerText = '';
                inputElement.parentElement.classList.remove('invalid');
            }
        });
    }
}
//Định nghĩa rules 
// Khi có lỗi thì trả ra message lỗi 
// Khi không có lỗi thì không trả ra gì cả (undefined)
Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : message ||'Vui lòng nhập trường này'
        }
    };
}

Validator.isEmail = function(selector, message      ) {
    return  {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
            return regex.test(value) ? undefined : message || 'Vui lòng nhập Email  đúng định dạng';
        }
    };
} 

Validator.minLength = function(selector, min) {
    return  {
        selector: selector,
        test: function(value) {
            
            return value.length >=  min  ? undefined : `Vui lòng nhập tối thiếu ${min} kí tự`;
        }
    };
} 

Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector ,
        test: function (value ) {
            return value === getConfirmValue() ? undifined : message || 'Giá trị nhập vào không chính xác '
        }
    }
}