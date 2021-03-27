﻿(() => {
    const app = Vue.createApp({
        data() {
            return {
                items: null
            };
        }
    });
    app.component('career-dates', CareerDates);
    const vm = app.mount('#careerDates');
    

    window.getContracts = getContracts;

    function getContracts(contractName) {
        vm.items = null;
        if (contractName) {
            vm.contracts = null;
            fetch(`/api/careerlogs/contracts/${contractName}`)
                .then((res) => res.json())
                .then((jsonContracts) => {
                    vm.items = jsonContracts;
                })
                .catch((error) => alert(error));
        }
    }
})();