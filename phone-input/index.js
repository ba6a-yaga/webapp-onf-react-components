import React, { Component } from 'react'

export class PhoneInput extends Component {
    inputField = React.createRef()
    
    constructor(props) {
        super(props)
        this.phonePattern = '(___) ___-__-__'
        this.dialCode= '+7'
        this.regexp = /([0-9_]{3})([0-9_]{3})([0-9_]{2})([0-9_]{2})/
        
        this.state = {
            value: '',
        }
    }

    onChange(e) {
        this.inputValue = e.target.value.slice(this.dialCode.length);
        this.updateInputPhone(this.inputValue);
        const inputField = this.inputField.current
        const underscoreIndex = this.inputValue.indexOf('_');
        const selection = inputField.selectionStart - 2;
        e.target.value = this.inputValue;
        let caretIndex = 0
        if (e.nativeEvent.inputType === 'deleteContentBackward') {
            const re = /[\d]/g;
            const stringNumber = this.inputValue.substring(
                0,
                selection
            );
            let myArray;
            let lastIndex = 0;
            do {
                myArray = re.exec(stringNumber);
                if (myArray !== null) {
                    lastIndex = myArray.index;
                }
            } while (myArray !== null);
            caretIndex = lastIndex + 1 + this.dialCode.length
        } else if (
            selection < underscoreIndex ||
                    underscoreIndex === -1
        ) {
            const index = this.inputValue
                            .substring(selection - 1)
                            .search(/([0-9_])/) + selection;
            caretIndex = index + this.dialCode.length
        } else if (underscoreIndex !== -1) {
            caretIndex = underscoreIndex  + this.dialCode.length
        }
        this.setState({value:this.dialCode + this.inputValue}, ()=> {
            this.setCaretPosition(inputField, caretIndex);
        })
    }

    updateInputPhone(val) {
        let tmp = val.replace(/[^0-9]/g, '');
        while (tmp.length < this.getDigitsCount()) {
            tmp += '_';
        }
        tmp = tmp.replace(
            this.regexp,
            '($1) $2-$3-$4'
        );
        this.inputValue = tmp.substr(0, this.phonePattern.length);
    }
  
    setCaretPosition(elem, caretPos) {
        if (elem != null) {
            if (elem.createTextRange) {
                const range = elem.createTextRange();
                range.move('character', caretPos);
                range.select();
            } else if (elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            } else {
                elem.focus();
            }
        }
    }

    getDigitsCount() {
        let digits = 0;
        for (let i = 0; i < this.phonePattern.length; i++) {
          if (this.phonePattern[i] === '_') {
            digits++;
          }
        }
        return digits;
    }

    render() {
        const {value} = this.state
        return (
            <input type="text" value={value} placeholder="+7(" onChange={this.onChange.bind(this)} ref={this.inputField}/>
        )
    }
}

export default PhoneInput
