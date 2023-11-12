const dotenv = require('dotenv');

const namedColors = require("color-name-list");
const translate = require('translate');

dotenv.config();

translate.engine = process.env.TRANSLATE_ENGINE;
translate.key = process.env.TRANSLATE_KEY;

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const capitalize2 = (string) => {
  return string.split(' ').map(capitalize).join(' ')
  .replace(" In ", " in ")
  .replace(" Of ", " of ");
}

const parseColor = async (color) => {
  let isColor = /^#[0-9A-F]{6}$/i.test(color);
  if(!isColor) {
    isColor = /^[0-9A-F]{6}$/i.test(color);
  }

  if(!isColor) {
    let cp = capitalize2(color);
    let someNamedColor = namedColors.find(color => color.name === cp);
    if(typeof someNamedColor !== 'undefined') {
      return someNamedColor.hex;
    } else {
      const translated_color = await translate(cp, { from: 'pt', to: 'en' });
      someNamedColor = namedColors.find(color => color.name === translated_color);
      if(typeof someNamedColor !== 'undefined') {
        return someNamedColor.hex;
      }  else {
        return -1;
      }
    }
  } else {
    return color;
  }
}

exports.parseColor = parseColor;