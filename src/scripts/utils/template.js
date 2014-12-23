function template(string, data){

    var compiledString;

    Object.keys(data).forEach(function (key) {
        //Note: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter
        compiledString = string.replace(new RegExp('{' + key + '}','g'), data[key]);
    });

    return compiledString;
}

module.exports = template;
