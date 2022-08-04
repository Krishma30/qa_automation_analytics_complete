import React from 'react';
import { Icon, Dropdown } from 'semantic-ui-react';
import matchSorter from 'match-sorter';
import _ from 'lodash';

import {} from 'semantic-ui-react';

const CSV_PATH = `${process.env.REACT_APP_TESTING_S3_BUCKET}/results/`;

function getResultsPath(sessionId, filename) {
  return `${CSV_PATH}${sessionId}/${filename}`;
}

export const analyticsColumns = [

  {
    id: 'siteName',
    Header: 'Site Name',
    width: 300,
    accessor: d => {
       return d.siteName;

    }, 
    
    filterMethod: (filter, rows) =>
    matchSorter(rows, filter.value, { keys: ['siteName'] }),
    filterAll: true,
    PivotValue: ({ value, subRows }) => 
     (
     <span style={{ color: 'blue' }}>
        ({subRows.length}) {value}
      </span>
    )
  }, 
  {
    id: 'url',
    Header: 'Site URL',
    width: 400,
    style: { 'white-space': 'unset' },
    accessor: d => {
       return d.url;
    }
    }, 
  
  {
    Header: 'Event Type',
    accessor: 'type',
    width: 160,
    filterable: true,
    aggregate: (vals, tableData) => {
      var sum = 0;
      _.each(tableData, i => {
        return i._original.status == 'type' ? sum++ : sum;
      });
    },
    Aggregated: row => {
      //  console.log("aggregated", row);
      return <span>{row.value} </span>;
    }
  }, 
  {
    id: 'analyticsType',
    Header: 'Analytics Type',
    accessor: 'analyticsType',
    
  width: 100,
    filterable: true,
   // render: e => <a href={e.analyticsType}> {e.value} </a>,
    aggregate: (vals, tableData) => {  
      var sum = 0;
      _.each(tableData, i => {
        return i._original.status == 'analyticsType' ? sum++ : sum;
      });
     // return sum;
    },
    Aggregated: row => {
      
    
      return <span>{row.value} </span>;
    }
  },
  {
    Header: '# Pages',
    accessor: 'failed',
    width: 60,
    filterable: true,
    sortable: true,
    aggregate: (vals, tableData) => {
      var sum = 0;
      _.each(tableData, i => {
        return i._original.status == 'failed' ? sum++ : sum;
          if(sum>1)
          {
            i.tableData ="green-cell";
          }
        
      });
    },
    Aggregated: row => {
      return <span>{row.value} </span>;
    }
  }, 

  {
    Header: 'Failed',
    id: 'failCount',
    accessor: d => d.failCount,
    width: 50,
    filterable: true,
    aggregate: (vals, tableData) => {
      var sum = 0;
      _.each(tableData, i => {
        return i._original.status == 'failed' ? sum++ : sum;
      });
      return sum;
    },
    Aggregated: row => {
      return <span>{row.value} </span>;
    }
  }, 

  {
    id: 'testsRun',
    Header: 'Total Test Run',
    accessor: 'testsRun',
    width: 60, 
    aggregate: (vals, tableData) => {
      var sum = 0;
      _.each(tableData, i => {
        return (i._original.status == 'failed' || i._original.status == 'success') ? sum++ : sum;
      });
      return sum;
    },
    Aggregated: row => {
      return <span>{row.value} </span>;
    },
    filterable: false
  },
  {
    id: 'date',
    Header: 'Date',
    accessor: d => new Date(d.date).toLocaleDateString(),
    Cell: d => {
      const date = new Date(d.value).toLocaleDateString();
      return <span> {date}</span>;
    },
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ['date'] }),
    filterAll: true,
    width: 100,

    sortMethod: (a, b) => new Date(b.date) - new Date(a.date),
    sortable: false,
    aggregate: vals => new Date(vals[0]).toLocaleDateString(),
    Aggregated: row => <span>{row.value}</span>
  },

  {
    id: 'sessionId',
    accessor: d => d.Id,
    filterable: false,
    Header: 'ID',
    style: { 'white-space': 'unset' },
    aggregate: vals => vals[0],
    Aggregated: () =>
     {
      return <span />;
    }
    },
    {
      Header: 'Errors',
      id: 'reason',
      accessor: d => d.reason,
      width: 300,
      style: { 'white-space': 'unset' },
      aggregate: () => '',
      Aggregated: () => {
        return <span />;
      },
      filterable: false,
      sortable: true
    }

];



export const beforeColumns = [
  {
    id: 'siteName',
    Header: 'Site Page',
    width: 300,
    accessor: d => d.siteName,
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ['siteName'] }),
    filterAll: true,
    PivotValue: ({ value, subRows }) => (
      <span style={{ color: 'darksalmon' }}>
        ({subRows.length}) {value}
      </span>

    )
  },
  {
    id: 'date',
    Header: 'Date',
    accessor: d => new Date(d.date).toUTCString(),
    Cell: d => {
      const date = new Date(d.value).toUTCString();
      return <span>{date}</span>;
    },
    
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ['date'] }),
    filterAll: true,
    width: 140,
    
    sortMethod: (a, b) => new Date(b.date) - new Date(a.date),
    sortable: false,
    aggregate: vals => new Date(vals[0]).toUTCString(),
    Aggregated: row => <span>{row.value}</span>
  },
  {
    id: 'testsRun',
    Header: 'Total Test Run',
    aggregate: (vals, tableData) => tableData.length,
    Aggregated: row => {
      const value = row.value ? row.value.toLocaleString() : 0;
      return <span>{value} (Total)</span>;
    },
    accessor: d => {
      const completed = d.completed ? d.completed : d.counter;
      return `${completed} `;
    },
    filterable: false
  },
  {
    Header: 'Failed',
    accessor: 'failCount',
    width: 60,
    filterable:true,
    aggregate: (vals, tableData) => {
      var sum = 0;
      _.each(tableData, i => {
        return i._original.status == 'failed' ? sum++ : sum;
      });
      return sum;
    },
    Aggregated: row => {
      return <span>{row.value} (avg)</span>;
    }
  },

  {
    id: 'sessionId',
    accessor: d => d.Id,
    filterable: true,
    Header: 'Session ID',
    aggregate: vals => vals[0],
    Aggregated: () => {
      return <span />;
    }
  },
  {
    Header: 'Errors',
    accessor: 'sessionId',
    Cell: item => {
      //console.log("cell item",item);
      if (item.row.reason) {
        return <span className="failure">{item.row.reason}</span>;
      } else {
        return <span />;
      }
    },
    aggregate: () => '',
    Aggregated: () => {
      return <span />;
    },
    filterable: false,
    sortable: false
  }
];


export const uploadColumns = [
  {
    id: 'date',
    Header: 'Date',
    accessor: d => new Date(d.date).toUTCString(),
    width: 240,
    sortMethod: (a, b) => new Date(b.date) - new Date(a.date),
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ['date'] }),
    filterAll: true
  },
  {
    Header: 'Key',
    accessor: 'key',
    width: 200,
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ['key'] }),
    filterAll: true
  },
  {
    id: 'exclusions',
    Header: 'Exclusions',
    accessor: d =>
      d.exclusions ? d.exclusions : 'No exclusions set up for this CSV file',
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ['exclusions'] }),
    filterAll: true
  }
];

export const errorCsvColumns = [
  {
    Header: 'Url',
    accessor: 'url',
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ['url'] }),
    filterAll: true,
    aggregate: () => <span />
  },
  {
    id: 'shortError',
    Header: 'Short Error Description',
    accessor: d => d.shortError,
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ['shortError'] }),
    filterAll: true,
    PivotValue: ({ value, subRows }) => (
      <span style={{ color: 'red' }}>
        ({subRows.length}) {value}
      </span>
    )
  },
  {
    Header: 'Long Error Description',
    accessor: 'longError',
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ['longError'] }),
    filterAll: true,
    aggregate: () => <span style={{ color: 'darkblue' }} />
  },
  {
    Header: 'Event Type',
    accessor: 'analyticsType',
    width: 160,
    filterable: true,
    aggregate: (vals, tableData) => {
      var sum = 0;
      _.each(tableData, i => {
        return i._original.status == 'analyticsType' ? sum++ : sum;
      });
    },
    Aggregated: row => {
      //  console.log("aggregated", row);
      return <span>{row.value} </span>;
    }
  }, // Col 3: Need accessor for this
  {
    Header: 'Analytics Type',
    accessor: 'type',
    width: 160,
    filterable: true,
    aggregate: (vals, tableData) => {
      var sum = 0;
      _.each(tableData, i => {
        return i._original.status == 'type' ? sum++ : sum;
      });
    },
    Aggregated: row => {
      //  console.log("aggregated", row);
      return <span>{row.value} </span>;
    }
  }
];

function tidyValueAndAddPostfix(value, postfix) {
  if (value === 0) {
    return '';
  } else if (value < 2) {
    return `${value} ${postfix} `;
  } else {
    return `${value} ${postfix}s `;
  }
}

function durationFormatter(value) {
  if (value) {
    const days = tidyValueAndAddPostfix(value.days, ' day');
    const hours = tidyValueAndAddPostfix(value.hours, ' hour');
    const minutes = tidyValueAndAddPostfix(value.minutes, ' min');
    const seconds = tidyValueAndAddPostfix(value.seconds, ' sec');
    return `${days} ${hours} ${minutes} ${seconds}`;
  }
  return 'TEST Pending';
}
