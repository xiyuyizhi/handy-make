module.exports = api => {
    api.addFeature({
        name: "state management",
        value: "stateManagement"
    });

    api.addChoicesBelowFeature({
        type: "list",
        name: "state",
        message: "请选择要使用的状态管理方式",
        when: answers => {
            return (
                answers.features && answers.features.includes("stateManagement")
            );
        },
        choices: [
            {
                name: "default(reactContextApi)",
                value: "normal"
            },
            {
                name: "mobx",
                value: "mobx"
            },
            {
                name: "redux",
                value: "redux"
            },
            {
                name: "dva",
                value: "dva"
            }
        ]
    });
};
