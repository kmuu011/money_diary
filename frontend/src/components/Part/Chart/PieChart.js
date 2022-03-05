import React, {useEffect, useState} from 'react';
import './PieChart.scss';

import {Pie} from '@reactchartjs/react-chart.js';

import {UserStore} from "UserStore/UserStore";
import utils from "utils/utils";
import API_history from 'api/account/history/history';

function PieChart() {
    let [ getChartData, setChartData ] = useState(null);
    let [ getOptions, setOptions ] = useState(null);

    useEffect(() => {
        selectChartData();
    }, []);

    UserStore.pieChartReload = selectChartData;

    if(getChartData === null) return null;

    async function selectChartData () {
        let params = { account_idx:UserStore.account_idx,
            type: UserStore.getType,
            year:UserStore.getYear,
            month:UserStore.getMonth };

        let result = await API_history.selectChartSetting(params);

        if(result.status !== 200){
            alert(result.data.message);
        }

        result = result.data;

        let label = '원형그래프';
        let borderWidth = 0.1;

        let chartData = {
            labels: result.labels,
            datasets: [{
                label,
                data: result.data,
                backgroundColor: result.backgroundColor,
                borderColor: result.borderColor,
                borderWidth
            }]
        };

        if(result.labels.length === 0){
            chartData = {
                labels: ['없음'],
                datasets: [{
                    label,
                    data: [100],
                    backgroundColor: ['#f9fafb'],
                    borderColor: ['#f9fafb'],
                    borderWidth
                }]
            }
        }

        let options = {
            layout: {
            },
            onClick:function(e, item){
                if(item.length === 0) return;
                let index = item[0]['_index'];
                let category_idx = result.category_idx[index];
                let amount = result.amount[index];

                UserStore.getCategory = category_idx;
                UserStore.setCategory(category_idx);
                UserStore.getTypeAmount = utils.commaParser(amount);
                UserStore.setTypeAmount(utils.commaParser(amount));

                UserStore.historyReset = true;

                UserStore.historyReload();
            },
            tooltips:{
                callbacks:{
                    title: function(tooltipItem, data) {
                        let index = tooltipItem[0].index;
                        return data.labels[index];
                    },
                    label: function(tooltipItem, data) {
                        let index = tooltipItem.index;
                        return data.datasets[0].data[index] + '%';
                    }
                }
            },
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 12,
                    fontColor: '#111827'
                },
                onClick: function (e, legendItem) {
                    let ci = this.chart.getDatasetMeta(0).data;
                    let index = legendItem.index;
                    let amount = result.amount[index];

                    let target = ci[index];

                    let total_amount = parseInt(UserStore.getTotalAmountPie.replace(/,/g, ''));

                    if(target.hidden){
                        target.hidden = false;
                        UserStore.setTotalAmountPie(utils.commaParser(total_amount+amount));
                    }else{
                        target.hidden = true;
                        UserStore.setTotalAmountPie(utils.commaParser(total_amount-amount));
                    }

                    this.chart.update();
                }

            }
        };

        UserStore.setTotalAmountPie(utils.commaParser(result.total_amount));

        setChartData(chartData);
        setOptions(options);
    }

    return (
        <div className={"pie_chart_body"}>
            <Pie data={getChartData} options={getOptions} />

        </div>
    );
}






export default PieChart;
