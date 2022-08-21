﻿const Facilities = {
    mixins: [DataTabMixin],
    methods: {
        queryData(careerId) {
            const p1 = fetch(`/api/careerlogs/${careerId}/facilities`)
                .then(res => res.json())
                .then(jsonItems => {
                    return jsonItems.filter(e => e.state != 'ConstructionCancelled');
                });
            const p2 = fetch(`/api/careerlogs/${careerId}/lcs`)
                .then(res => res.json())
                .then(jsonItems => {
                    return jsonItems.filter(e => e.state != 'ConstructionCancelled');
                });

            Promise.all([p1, p2])
                .then((values) => {
                    this.isLoading = false;
                    const facilityItems = values[0];
                    const lcItems = values[1];
                    const combinedItems = facilityItems.concat(lcItems);
                    combinedItems.sort((a, b) => {
                        const v1 = a.started ? a.started : a.constrStarted;
                        const v2 = b.started ? b.started : b.constrStarted;
                        if (v1 < v2) {
                            return -1;
                        }
                        if (v1 > v2) {
                            return 1;
                        }

                        return 0;
                    });
                    this.items = combinedItems;
                })
                .catch(error => alert(error));
        },
        getLCIcon(lc) {
            if (lc.lcType === 'Pad') return 'fa-rocket';
            if (lc.lcType === 'Hangar') return 'fa-plane';
            return '';
        },
    },
    computed: {
        tabName() {
            return 'facilities';
        }
    },
    template: `
        <div v-show="isVisible">
            <h2 class="subtitle">Facility construction and upgrades</h2>

            <table class="table is-bordered is-fullwidth is-hoverable">
            <thead>
                <tr>
                    <th>Facility</th>
                    <th>Level / Max tonnage</th>
                    <th>Started</th>
                    <th>Completed</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="item in items">
                    <tr v-if="item.lcType">
                        <td>
                            <span class="icon is-small"><i class="fas mr-2" :class="getLCIcon(item)" aria-hidden="true"></i></span>
                            <span>{{ item.name }}</span>
                        </td>
                        <td>{{ item.massMax }}</td>
                        <td>{{ formatDate(item.constrStarted) }}</td>
                        <td>{{ formatDate(item.constrEnded) }}</td>
                    </tr>
                    <tr v-if="!item.lcType">
                        <td>{{ item.facility }}</td>
                        <td>{{ item.newLevel + 1 }}</td>
                        <td>{{ formatDate(item.started) }}</td>
                        <td>{{ formatDate(item.ended) }}</td>
                    </tr>
                </template>
            </tbody>
            </table>
        </div>
        <div v-if="isSpinnerShown" class="columns mt-4 is-centered is-vcentered">
            <loading-spinner></loading-spinner>
        </div>`
};
