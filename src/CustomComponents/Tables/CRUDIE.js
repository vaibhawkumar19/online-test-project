import { useState, useEffect } from "react";

import { getInputBoxFromType } from "../../services/editTable";

const CRUDIE = ({
    data,
    columns,
    filterableCols,
    sortableCols,
    tableHeader,
    recordsPerPageOption,
    defaultRecordPerPage,
    uniqueId,
}) => {

    const [tabData, setTabData] = useState();
    const [sortedColumn, setSortedColumn] = useState("");
    const [sortedAsc, setSortedAsc] = useState(0);
    const [valuesToBeFiltered, setValuesToBeFiltered] = useState();
    const [filterableColumn, setFilterableColumn] = useState(
        columns.filter((col) => col.filterable)
    );
    // const [filterStrings, setFilterString] = useState();

    const [recordsPerPage, setRecordsPerPage] = useState(defaultRecordPerPage);

    const [pages, setPages] = useState(Math.ceil(data.length / recordsPerPage));
    const [pageNo, setPageNo] = useState(1);
    const [pageStartIndex, setPageStartIndex] = useState(0);
    const [pageEndIndex, setPageEndIndex] = useState(recordsPerPage - 1);
    const [datainPage, setDatainPage] = useState(
        data.filter((item, index) => index < recordsPerPage)
    );
    const [selectedOneRowForEdit, setSelectedOneRowForEdit] = useState();
    const [selectedOneRowForDelete, setSelectedOneRowForDelete] = useState();
    const [createNewRecordFormOpen, setCreateNewRecordFormOpen] = useState(false);

    useEffect(() => {
        let filteredTempObj = {};
        filterableCols.forEach((elemt) => {
            if (elemt.filterable) {
                filteredTempObj[elemt.column] = "";
            }
        });

        const tempData = data.map(itemRow => ({ ...itemRow, selectedCurrentRow: false }))
        setTabData(tempData);
        setValuesToBeFiltered(filteredTempObj);


        let start = 0;
        let end = Math.min(recordsPerPage - 1, tempData.length - 1);

        // console.log(filteredData);

        let tempDataArray = [];
        for (let index = start; index <= end; index++) {
            tempDataArray.push(tempData[index]);
        }

        // setRecordsPerPage(recordsPerPage);
        setPages(Math.ceil(data.length / recordsPerPage));
        setPageNo(1);
        setDatainPage(tempDataArray);
    }, []);


    const changeFilterableInputs = (e) => {
        const { name, value } = e.target;

        let tempFilteredStringObject = { ...valuesToBeFiltered, [name]: value };

        console.log(tempFilteredStringObject);
        // filterLogic to be implemented here

        let filteredData = data.filter((itemRow) => {
            let dataPresentInRow = true;
            columns.forEach((cols, index) => {
                let columnName = cols.column;

                let columnData = itemRow[columnName].toString();

                if (
                    cols.filterable &&
                    tempFilteredStringObject[columnName] !== "" &&
                    !columnData.includes(tempFilteredStringObject[columnName])
                ) {
                    console.log(tempFilteredStringObject[columnName], columnData);
                    dataPresentInRow = false;
                }
            });

            return dataPresentInRow;

            // return filterableColumn.some((colName, index) =>
            //   itemRow[colName].includes(valuesToBeFiltered[colName])
            // );
        });

        setTabData([...filteredData]);
        let start = 0;
        let end = Math.min(recordsPerPage - 1, filteredData.length - 1);

        console.log(filteredData);

        let tempDataArray = [];
        for (let index = start; index <= end; index++) {
            tempDataArray.push(filteredData[index]);
        }

        // setRecordsPerPage(recordsPerPage);
        setPages(Math.ceil(data.length / recordsPerPage));
        setPageNo(1);
        setDatainPage(tempDataArray);

        console.log(tempDataArray);

        setValuesToBeFiltered(tempFilteredStringObject);
        // console.log({ ...valuesToBeFiltered, [name]: value })
        // console.log(e.target.name, e.target.value)
    };

    // const PopUp = ({ filterableColumns }) => {
    //   // console.log("popv b", filterableColumns)
    //   filterableCols.forEach(element => {
    //     console.log(element)
    //   });

    //   return <div className={"popup " + true ? "showpopup" : "hidepopup"}>
    //     <button onClick={() => closePopup()}>close</button>
    //     <div>        {
    //       filterableColumns.map((oneCol) =>
    //         <div><span>{oneCol.column} : </span><input value={oneCol.column} /></div>

    //       )
    //     }</div>

    //   </div>

    // }

    // const closePopup = () => {
    //   setPopupVisibility(!popupVisibility);
    // }

    // const sortColumn = (col, asc) => {

    //   if (asc) {
    //     setSortedAsc(1);
    //   }
    //   else {
    //     setSortedAsc(-1);
    //   }

    //   if (sortedColumn !== col) {

    //     setSortedAsc(1);
    //     setSortedColumn(col);
    //   }
    //   let sortedData = asc
    //     ? data.sort((row1, row2) => (row1[col] > row2[col]) ? 1 : (row1[col] < row2[col]) ? -1 : 0)
    //     : data.sort((row1, row2) => (row1[col] > row2[col]) ? -1 : (row1[col] < row2[col]) ? 1 : 0)

    //   setTabData([...sortedData]);
    // };

    const editFormContentChange = (e) => {
        const { name, value } = e.target;
        setSelectedOneRowForEdit({ ...selectedOneRowForEdit, [name]: value });
    };

    const onUpdateConfirm = () => {
        let tempUpdatedData = tabData.map((item) =>
            item[uniqueId] === selectedOneRowForEdit[uniqueId]
                ? selectedOneRowForEdit
                : item
        );

        let tempDataArray = [];
        for (let index = pageStartIndex; index <= pageEndIndex; index++) {
            tempDataArray.push(tempUpdatedData[index]);
        }
        setDatainPage(tempDataArray);

        setSelectedOneRowForEdit(null);
    };

    const onUpdateCancel = () => {
        setSelectedOneRowForEdit(null);
    };

    const onDeleteConfirm = (selectedRow) => {
        // console.log(selectedRow, tabData)
        let tempRowData = tabData.filter(
            (row) => row[uniqueId] !== selectedRow[uniqueId]
        );
        setTabData(tempRowData);

        let pagesLeftNow = Math.ceil(tempRowData.length / recordsPerPage);
        console.log(pagesLeftNow);
        let tempDataArray = [];
        let start = Math.max((pagesLeftNow - 1) * recordsPerPage, 0);
        let end = Math.min(
            pagesLeftNow * recordsPerPage - 1,
            tempRowData.length - 1
        );

        for (let index = start; index <= end; index++) {
            tempDataArray.push(tempRowData[index]);
        }

        console.log(pagesLeftNow, pageNo, start);
        if (pagesLeftNow < pageNo) setPageNo(pagesLeftNow);
        setPages(pagesLeftNow);
        setDatainPage(tempDataArray);

        // recordSelectionPerPageChange(recordsPerPage)
        setSelectedOneRowForDelete(null);
    };

    const onDeleteCancel = () => {
        setSelectedOneRowForDelete(null);
    };

    const editRow = (selectedOneRow) => {
        // EditOneRowPopUp
        // call edit popup form here
        console.log(selectedOneRow);
        setCreateNewRecordFormOpen(false);
        setSelectedOneRowForEdit(selectedOneRow);
    };

    const deleteRow = (selectedOneRow) => {
        // Call confirmation popup here
        // DeleteOneRowPopUp
        setSelectedOneRowForDelete(selectedOneRow);
        console.log(selectedOneRow);
    };

    const changePage = (next) => {
        let page = next
            ? pageNo + 1 > pages
                ? pages
                : pageNo + 1
            : pageNo - 1 < 1
                ? 1
                : pageNo - 1;

        let start = Math.max((page - 1) * recordsPerPage, 0);
        console.log(tabData);
        let end = Math.min(page * recordsPerPage - 1, tabData.length - 1);

        console.log(start, end, pages, page);
        console.log(tabData.length);
        let tempDataArray = [];
        for (let index = start; index <= end; index++) {
            tempDataArray.push(tabData[index]);
        }

        setPageNo(page);
        setPageStartIndex(start);
        setPageEndIndex(end);
        setDatainPage(tempDataArray);
    };

    const sortColumn = (col, asc) => {
        if (asc) {
            setSortedAsc(1);
        } else {
            setSortedAsc(-1);
        }

        if (sortedColumn !== col) {
            setSortedAsc(1);
            setSortedColumn(col);
        }
        let sortedData = asc
            ? data.sort((row1, row2) =>
                row1[col] > row2[col] ? 1 : row1[col] < row2[col] ? -1 : 0
            )
            : data.sort((row1, row2) =>
                row1[col] > row2[col] ? -1 : row1[col] < row2[col] ? 1 : 0
            );

        setTabData([...sortedData]);

        console.log(sortedData, pageStartIndex, pageEndIndex);
        let tempDataArray = [];
        for (let index = pageStartIndex; index <= pageEndIndex; index++) {
            tempDataArray.push(sortedData[index]);
        }

        console.log(tempDataArray, pageStartIndex, pageEndIndex);

        setDatainPage(tempDataArray);
    };

    const recordSelectionPerPageChange = (noOfRecords) => {
        let start = 0;
        let end = Math.min(noOfRecords - 1, tabData.length - 1);

        let tempDataArray = [];
        for (let index = start; index <= end; index++) {
            tempDataArray.push(tabData[index]);
        }

        setPageStartIndex(start);
        setPageEndIndex(end);
        setRecordsPerPage(noOfRecords);
        // setPages(Math.ceil(data.length / noOfRecords));
        setPageNo(1);
        setDatainPage(tempDataArray);
    };

    const createNewRecord = () => {
        console.log(selectedOneRowForEdit);

        let inputFormData = {};

        columns.forEach((col) => {
            inputFormData[col.column] =
                col.formInputDetails && col.formInputDetails.defaultVal
                    ? col.formInputDetails.defaultVal
                    : "";
        });

        console.log(inputFormData);
        setSelectedOneRowForEdit({ ...inputFormData });
        setCreateNewRecordFormOpen(true);
    };

    const onAddNewRecord = () => {
        // let maxId = 39;

        // console.log(selectedOneRowForEdit)
        let tabDataTemp = [
            ...tabData,
            {
                ...selectedOneRowForEdit,
                [uniqueId]: parseInt(selectedOneRowForEdit[uniqueId]),
            },
        ];

        console.log(tabDataTemp);

        setTabData(tabDataTemp);
        let tempDataArray = [];

        for (let index = pageStartIndex; index <= pageEndIndex; index++) {
            tempDataArray.push(tabDataTemp[index]);
        }
        setPages(Math.ceil(tabDataTemp.length / recordsPerPage));
        setDatainPage(tempDataArray);
    };


    const onMulitSelectChange = (e, selectedRow) => {
        const checkedVal = e.target.checkedVal;
        const tempData = tabData.map(itemRow => (itemRow[uniqueId] === selectedRow[uniqueId] ? { ...itemRow, selectedCurrentRow: checkedVal } : itemRow))
        // console.log(e.target.checked)

        setTabData([...tempData]);

        let start = 0;
        let end = Math.min(recordsPerPage - 1, tempData.length - 1);

        // console.log(filteredData);

        let tempDataArray = [];
        for (let index = start; index <= end; index++) {
            tempDataArray.push(tempData[index]);
        }

        // setRecordsPerPage(recordsPerPage);
        setPages(Math.ceil(data.length / recordsPerPage));
        setPageNo(1);
        setDatainPage(tempDataArray);
    }

    return <div>
        <>
            <button onClick={createNewRecord}>Create New</button>
            <button>Delete</button>
            <button>Import</button>
            <button>Export</button>
        </>

        <>
            {selectedOneRowForEdit && (
                <div>
                    Popup Form
                    {columns.map((col, index) =>
                        getInputBoxFromType(
                            col,
                            selectedOneRowForEdit,
                            editFormContentChange,
                            index
                        )
                    )}
                    {createNewRecordFormOpen ? (
                        <button onClick={() => onAddNewRecord()}>Create New</button>
                    ) : (
                        <button onClick={() => onUpdateConfirm()}>Update</button>
                    )}
                    <button onClick={() => onUpdateCancel()}>Cancel</button>
                </div>
            )}
        </>

        <>
            {selectedOneRowForDelete && (
                <div>
                    Popup Delete , Are you sure want to delete id :{" "}
                    {selectedOneRowForDelete[uniqueId]}
                    <button onClick={() => onDeleteConfirm(selectedOneRowForDelete)}>
                        Delete
                    </button>
                    <button onClick={() => onDeleteCancel(selectedOneRowForDelete)}>
                        Cancel
                    </button>
                </div>
            )}
        </>

        {tableHeader && <h2 className="tableHeader">{tableHeader}</h2>}
        <table>
            <tr>
                <th></th>
                {columns.map((col, index) => (
                    <th>{col.column}
                    </th>
                ))}
                <th>Edit</th>
                <th>Delete</th>
            </tr>

            <tr>
                <th></th>
                {columns &&
                    valuesToBeFiltered &&
                    columns.map((col, index) => (

                        <th>
                            {col.filterable ? (
                                <input
                                    placeholder={col.column}
                                    value={valuesToBeFiltered[col.column]}
                                    name={col.column}
                                    onChange={(e) => changeFilterableInputs(e)}
                                />
                            ) : (
                                <input disabled />
                            )}
                        </th>
                    ))}
            </tr>

            {datainPage &&
                datainPage.map((row) => {
                    return (
                        <tr>
                            <td>{row.selectedCurrentRow}<input type="checkbox" id={"checkBox_" + row[uniqueId]} name="selectCheckBox" checked={row.selectedCurrentRow} onChange={(e) => onMulitSelectChange(e, row)} /></td>
                            {columns.map((col) => (
                                <td>{row[col.column]}</td>
                            ))}
                            <td>
                                <button onClick={() => editRow(row)}>Edit</button>
                            </td>

                            <td>
                                <button onClick={() => deleteRow(row)}>Delete</button>
                            </td>
                        </tr>
                    );
                })}
        </table>

        <button onClick={() => changePage(true)}>Next</button>
        <span>PageNo:- {pageNo}</span>
        <button onClick={() => changePage(false)}>Prev</button>

        <select
            name="recordsPerPage"
            onChange={(e) => recordSelectionPerPageChange(e.target.value)}
            value={recordsPerPage}
        >
            {recordsPerPageOption.map((item) => (
                <option value={item}>{item}</option>
            ))}
        </select>
    </div>
        ;
}

export default CRUDIE;