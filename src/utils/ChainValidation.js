import BadActorList from './BadActorList';

// eslint-disable-next-line import/prefer-default-export
export function validate_account_name(value) {
    let i, label, len;

    if (!value) {
        return 'Account name should not be empty';
    }
    const { length } = value;
    if (length < 3) {
        return 'Account name should be longer'
    }
    if (length > 16) {
        return 'Account name should be shorter'
    }
    if (BadActorList.includes(value)) {
        return 'Bad actor'
    }
    const ref = value.split('.');
    for (i = 0, len = ref.length; i < len; i += 1) {
        label = ref[i];
        if (!/^[a-z]/.test(label)) {
            return 'Each account segment should start with a letter'
        }
        if (!/^[a-z0-9-]*$/.test(label)) {
            return 'Each account segment should have only letters and dashes'
        }
        if (/--/.test(label)) {
            return 'Each account segment should have only one dash in a row'
        }
        if (!/[a-z0-9]$/.test(label)) {
            return 'Each account segment should have end with a letter or digit'
        }
        if (!(label.length >= 3)) {
            return 'Each account segment should be longer'
        }
    }
    return null;
}
