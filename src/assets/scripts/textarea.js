let textarea;

textarea = (() => {
    /**
     * Default settings
     * @type {{el: string, limit: number, words: null, rules: (function(*=): *), strict: boolean}}
     */
    let defaults = {
        el: '',
        limit: 100,
        words: null,
        strict: false,
        fn: null,
        rules: (e) => Object.assign(defaults, e)
    };
    /**
     * @type {{total: (function(): number), rem: (function(*): *)}}
     */
    let update = {
        total: () => document.querySelector('.txtLimit').innerHTML = defaults.limit,
        counter: (val) => document.querySelector('.txtCounter').innerHTML = val,
        rem: (val) => document.querySelector('.txtRem').innerHTML = val,
    };
    let call = {
        fn: (callback, args) => {
            if (typeof callback == "function") {
                callback(args);
            }
        }
    };
    let fn = {
        reg: {
            strict: '',
            nStrict: ''
        },
        init: () => {
            let filters = defaults.words,
                el = defaults.el,
                nsFilter;

            nsFilter = '(?:(^|[^a-z]))(([^a-z]*)(?=' + filters + ')' + filters + ')(?![a-z])';
            fn.reg.strict = (filters) && new RegExp(filters, 'gi'); // 'help|clear|what'
            fn.reg.nStrict = new RegExp(nsFilter, 'gi');
            update.total();

            if (el.tagName === 'TEXTAREA') {
                ['input', 'cut', 'keypress', 'paste', 'blur'].forEach(e => el.addEventListener(e, (ev) => {
                    fn.process(el, ev);
                }));
            }
        },
        process: (el, events) => {
            let lt, calc, sp, elVal;
            // If input is above limit, truncate.
            el.value = el.value.substr(0, defaults.limit);

            // Filter words
            if (events.code === 'Space' || events.type === 'blur') {
                el.value = (defaults.strict) ?
                    el.value.replace(fn.reg.strict, '') :
                    el.value.replace(fn.reg.nStrict, '');
            }
            elVal = el.value;
            lt = elVal.length;

            // set counter
            update.counter(lt);
            // set reverse counter
            update.rem(defaults.limit - lt);
            // calculate percentage of total length
            calc = (lt * 100 / defaults.limit);
            // No Space
            sp = elVal.replace(/\s/g, '').length;

            // Call custom functions with default arguments
            call.fn(defaults.fn, {
                events: events,
                inputs: elVal,
                perc: calc,
                counter: lt,
                nsCount: sp
            });
        }
    };
    return {
        set: defaults.rules,
        init: fn.init
    }
})();

export {
    textarea
};