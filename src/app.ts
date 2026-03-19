//validation
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatableInput: Validatable) {
    let isValid = true;

    if( validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }

    if( validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength
    }
    if( validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if( validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if( validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }

    return isValid;

}

// autoBind decorator
function autoBind(
    _: any,
    _2: string,
    descriptor: PropertyDescriptor
) {
    const origialMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = origialMethod.bind(this);
            return boundFn;
        }
    }
    return adjDescriptor;
}


class ProjectInput{
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';

        this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement;

        this.configure();
        this.attach();
    }

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = +this.peopleInputElement.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true
        }
        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            maxLength: 9
        }
        const peopleValidatable: Validatable = {
            value: enteredPeople,
            required: true,
            min: 1,
            max: 6
        };

        if(
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)
        ) {
            alert ('Invalid input, please try again!');
            return;
        } else {
        return [enteredTitle, enteredDescription, +enteredPeople];
        }

    }

    @autoBind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        console.log(userInput);
    }

    private configure () {
        this.element.addEventListener('submit', this.submitHandler);
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}

const prjInput = new ProjectInput();