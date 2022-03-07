import HtmlReady from './HtmlReady';
import { Remarkable } from 'remarkable';
import _ from 'lodash';

const remarkable = new Remarkable();

const getValidImage = (array) => {
    return array && Array.isArray(array) && array.length >= 1 && typeof array[0] === 'string' ? array[0] : null;
};

export function extractRtags(body = null) {
    let rtags;
    {
        const isHtml = /^<html>([\S\s]*)<\/html>$/.test(body);
        const htmlText = isHtml
            ? body
            : remarkable.render(body.replace(/<!--([\s\S]+?)(-->|$)/g, '(html comment removed: $1)'));
        rtags = HtmlReady(htmlText, { mutate: false });
    }

    return rtags;
}

export function extractImageLink(json_metadata, body = null) {
    const json = json_metadata || {};

    let jsonImage;
    if (typeof json.get === 'function') {
        jsonImage = json.get('image');
    } else {
        jsonImage = _.get(json, 'image');
    }
    let image_link;

    try {
        image_link = jsonImage ? getValidImage(Array.from(jsonImage)) : null;
    } catch (error) {
        // Nothing
    }

    // If nothing found in json metadata, parse body and check images/links
    if (!image_link) {
        const rtags = extractRtags(body);

        if (rtags.images) {
            [image_link] = Array.from(rtags.images);
        }
    }

    return image_link;
}