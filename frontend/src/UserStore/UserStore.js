import React from 'react';

export const UserStore = React.createContext(null);

function emptyMethod (){}

UserStore.setHistoryDateModal = emptyMethod;
UserStore.setModifyCategoryModal = emptyMethod;

UserStore.account_idx = null;

UserStore.nav_setter = null;
UserStore.getType = null;
UserStore.setType = null;

UserStore.getHistoryItem = null;
UserStore.setHistoryItem = null;

UserStore.getCategory = null;
UserStore.setCategory = null;

UserStore.getCategoryList = [];
UserStore.setCategoryList = null;

UserStore.getPage = null;
UserStore.setPage = null;

UserStore.getYear = null;
UserStore.setYear = null;

UserStore.getMonth = null;
UserStore.setMonth = null;

UserStore.getColor = null;
UserStore.setColor = emptyMethod;

UserStore.timeData = null;

UserStore.categoryReset = true;
UserStore.typeReset = false;
UserStore.originalType = null;

UserStore.categoryReload = emptyMethod;
UserStore.resetCategoryItem = emptyMethod;
UserStore.accountReload = emptyMethod;

UserStore.historyReload = emptyMethod;

UserStore.historyReset = false;

UserStore.calendarCreator = emptyMethod;

UserStore.calendarReload = emptyMethod;

UserStore.resetCalendarChecked = emptyMethod;

UserStore.monthSituationReload = emptyMethod;

UserStore.nextMonthAction = emptyMethod;
UserStore.previousMonthAction = emptyMethod;

UserStore.getTotalAmountPie = 0;
UserStore.setTotalAmountPie = emptyMethod;

UserStore.pieChartReload = emptyMethod;

UserStore.getTypeAmount = 0;
UserStore.setTypeAmount = emptyMethod;

UserStore.typeColorSetter = emptyMethod;

UserStore.showHelp = null;
UserStore.setShowHelp = emptyMethod;



