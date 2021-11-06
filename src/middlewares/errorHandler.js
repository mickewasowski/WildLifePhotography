exports.errorHandlerUponCreateOrUpdate = function(errorObject){
    let errors = Object.values(errorObject.errors);

        let errorMessagesArray = [];

        if (errors.length > 0) {
            errors.forEach(error => {
                errorMessagesArray.push(error.message);
            });
        }

        let fullNotification = errorMessagesArray.join('\n');

        return fullNotification;
}