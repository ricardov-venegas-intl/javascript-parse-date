
    var abrevations = {
        alabama: 'AL',
        alaska: 'AK',
        arizona: 'AZ',
        arkansas: 'AR',
        california: 'CA',
        colorado: 'CO',
        connecticut: 'CT',
        delaware: 'DE',
        districtofcolumbia: 'DC',
        florida: 'FL',
        georgia: 'GA',
        hawaii: 'HI',
        idaho: 'ID',
        illinois: 'IL',
        indiana: 'IN',
        iowa: 'IA',
        kansas: 'KS',
        kentucky: 'KY',
        louisiana: 'LA',
        maine: 'ME',
        maryland: 'MD',
        massachusetts: 'MA',
        michigan: 'MI',
        minnesota: 'MN',
        mississippi: 'MS',
        missouri: 'MO',
        montana: 'MT',
        nebraska: 'NE',
        nevada: 'NV',
        newhampshire: 'NH',
        newjersey: 'NJ',
        newmexico: 'NM',
        newyork: 'NY',
        northcarolina: 'NC',
        northdakota: 'ND',
        ohio: 'OH',
        oklahoma: 'OK',
        oregon: 'OR',
        pennsylvania: 'PA',
        puertorico: 'PR',
        rhodeisland: 'RI',
        southcarolina: 'SC',
        southdakota: 'SD',
        tennessee: 'TN',
        texas: 'TX',
        utah: 'UT',
        vermont: 'VT',
        virginia: 'VA',
        washington: 'WA',
        westvirginia: 'WV',
        wisconsin: 'WI',
        wyoming: 'WY'
    };
    var knownStates = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA',
        'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND',
        'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ]

    /**
    Parses a US address and return an object with zip, state, city, streetAddress 
    */
    function parseAddress(address) {
        var tokens = tokenize(address.trim())
        function getLastToken() { if (tokens.length == 0) throw "Invalid Address"; return tokens[tokens.length - 1]; }
        function removeLastToken() { if (tokens.length == 0) throw "Invalid Address"; tokens.splice(tokens.length - 1, 1); }
        var zip = '';
        if (getLastToken().type == 'number') {
            zip = getLastToken().value;
            removeLastToken();
            if (getLastToken().type == 'separator' && getLastToken().value == '-') {
                removeLastToken();
                if (getLastToken().type != 'number') {
                    throw "Invalid Zip Code"
                }
                zip = getLastToken().value + '-' + zip;
                removeLastToken();
            }
        }
        else {
            throw "Zip code not found";
        }
        while (getLastToken().type == 'space' || getLastToken().type == 'separator') {
            removeLastToken();
        }
        var state = '';
        state = getLastToken().value
        var stateIndex = knownStates.indexOf(state.toUpperCase())
        if (stateIndex == -1) {
            if (state in abrevations) {
               state = abrevations[state];
            }
            else { // Maybe is a two word state
                removeLastToken(); // remove curent space
                removeLastToken(); // remove separator
                state = getLastToken().value.toLowerCase() + state.toLowerCase();

                if (state in abrevations) {
                    state = abrevations[state];
                }
                else { // Maybe is a three word state
                    removeLastToken(); // remove curent space
                    removeLastToken(); // remove separator
                    state = getLastToken().value.toLowerCase() + state.toLowerCase();
                    if (state in abrevations) {
                        state = abrevations[state];
                        removeLastToken(); // remove separator
                    }
                    else {
                        throw "State not recognized";
                    }
                }
            }
        }
        while (getLastToken().type == 'space' || getLastToken().type == 'separator') {
            removeLastToken();
        }
        var city = '';
        while (getLastToken().type != 'separator') {
            city = getLastToken().value + city;
            removeLastToken();
        }
        removeLastToken();
        var streetAddress = ''
        for (var i = 0; i < tokens.length; i++) {
            streetAddress += tokens[i].value;
        }
        return { zip: zip, state: state, city:city, streetAddress: streetAddress };
    }

    function tokenize(text) {
        function isSpace(c) { return c == ' ' || c == '\t'; }
        function isDigit(c) { return !isNaN(c); }
        function isSeparator(c) { return c == ';' || c == ',' || c == '\n' || c == '-'; }
        result = [];
        var currentToken = ''
        while (text.length > 0) {
            if (isSpace(text[0])) {
                while (isSpace(text[0]) && text.length > 0) {
                    currentToken += text[0];
                    text = text.substr(1, text.length - 1);
                }
                result.push({ type: 'space', value: currentToken });
                currentToken = '';
            }
            else if (isDigit(text[0])) {
                while (isDigit(text[0]) && text.length > 0) {
                    currentToken += text[0];
                    text = text.substr(1, text.length - 1);
                }
                result.push({ type: 'number', value: currentToken });
                currentToken = ''
            }
            else if (isSeparator(text[0])) {

                result.push({ type: 'separator', value: text[0] });
                text = text.substr(1, text.length - 1);
            }
            else {
                while (!isDigit(text[0]) && !isSpace(text[0]) && !isSeparator(text[0]) && text.length > 0) {
                    currentToken += text[0];
                    text = text.substr(1, text.length - 1);
                }
                result.push({ type: 'word', value: currentToken });
                currentToken = ''
            }
        }
        return result;
    }




