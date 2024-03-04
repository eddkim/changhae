document.addEventListener("DOMContentLoaded", () => {
    // 페이지 로드시 자동 실행
    making_id();
    display_datetime();
    // 이 부분에 get 호출 ㄱㄱ

    
    // 이벤트 발생 시 호출
    const save_temp_btn = document.getElementById('save-temp-btn');
    const sent_database_btn = document.getElementById('sent-database-btn');

    save_temp_btn.addEventListener('click', ()=>{
        sent_data('save_temp')
    });
    sent_database_btn.addEventListener('click', ()=>{
        sent_data('insert_data')
    });

});


// 각 셀, 컬럼 ID LIST DATA ===============================================================================================================================

const set_culumns = 
[
    "yeast_equip_num","fer_equip_num","main_grain1_quantity_1","main_grain1_quantity_2","main_grain1_quantity_3","main_grain1_quantity_4",//~ cell6
    "main_grain2_quantity_1","main_grain2_quantity_2","main_grain2_quantity_3","main_grain2_quantity_4",//~ cell10
    "main_yeast_quantity","main_grain_total_quantity","valid_expected_alcohol","main_liquid_enzyme_1","main_liquid_enzyme_2","main_liquid_enzyme_3","main_liquid_enzyme_4",//~ cell17
    "valid_expected_alcohol_per_grains","main_stm_temperature_1","main_stm_temperature_2","main_stm_temperature_3","main_stm_temperature_4", //~ cell22
    "yeast_liquid_enzyme","yeast_stm_temperature","yeast_purified_enzyme","valid_theoretical_alcohol_per_grains","yeast_h3po4", //~ cell27
    "main_coenzyme","valid_increase_amount","main_brix_1","main_brix_2","main_brix_3","main_brix_4","yeast_brix_1","yeast_brix_2","yeast_brix_3", //~ cell36
    "main_acidity_1","main_acidity_2","main_acidity_3","main_acidity_4","yeast_acidity_1","yeast_acidity_2","yeast_acidity_3", //~ cell43
    "main_ph_1","main_ph_2","main_ph_3","main_ph_4","yeast_ph_1","yeast_ph_2","yeast_ph_1", //~ cell50
    "fer_final_time","fer_final_brix_glucose","fer_final_brix_maltose","fer_final_brix_maltotriose","fer_final_acidity_lactic","fer_final_acidity_acetic", //~ cell56
    "fer_final_ph","fer_final_alcohol","main_w_fg_1","main_w_fg_2","main_w_fg_3","main_w_fg_4","fer_empty_space", //~ cell63
    "fer_mash_total" //~ cell 64
];

const stack_culumns = 
[
    "fer_brix_glucose","fer_brix_maltose","fer_brix_maltotriose","fer_acidity_lactic","fer_acidity_acetic","fer_ph","fer_validation","fer_temperature" // 발효공정
]

const time_culumns =
[
    "yeast_test_time", "valid_starttime", "yeast_triangle_time", "valid_endtime", "yeast_rounded_time", // ~timecell 5
"main_insert_time_1", "main_insert_time_2", "main_insert_time_3", "main_insert_time_4", "yeast_yeast_time", "yeast_stm_time", // ~timecell 11
"yeast_analyze_time1", "yeast_analyze_time2", "yeast_analyze_time3", "fer_final_time","main_integration_time_1" // ~timecell 16
]

const toggle_on_classes = [
    '.brix1-toggle-on', '.brix2-toggle-on', '.brix3-toggle-on', '.acid1-toggle-on', '.acid2-toggle-on', '.ph-toggle-on', '.check-toggle-on', '.degree-toggle-on'
];

const ingredients = {
    "현미/겉보리":"1",
    "현미":"2",
    "T.P":"3",
    "겉보리":"4",
    "겉보리/T.P":"5",
    "현미/쇄미/겉보리":"6",
    "현미/쇄미":"7",
    "현미/백미":"8",
    "현미/겉보리/백미":"9",
    "현미/우리밀/백미":"10",
    "백미/우리밀/곁보리/현미":"11",
    "백미/우리밀/곁보리/현미/T.P":"12"
}

const durations = [
    "valid_fermentation_time",
    "yeast_elapsed_time"
]


// ======================================================================================================================================================
// API BODY 필수 DATA ====================================================================================================================================
const api_obj = {
    "host":"host.docker.internal",
    "database":"changhae_v3",
    "id":"postgres",
    "password":"apst2007",
    "port" : "6661",

}

// 셀 데이터를 추출 하는 함수 ==============================================================================================================================

const extract_text = (cell) => {
    const element = document.getElementById(cell);
    if (!element) {
        console.log(`Element with id '${cell}' does not exist.`);
        return null;
    }
    const content = element.innerText;
    const extractedText = content.replace(/[^\d.]/g, '');
    // console.log(extractedText.trim() === "" ? 'null' : extractedText);
    return extractedText;
};

const extract_time = (cell) => {
    time_data_array = []
    document.querySelectorAll(cell).forEach((element, index) => {
        const datetimeValue = element.value;
        const selectedTime = datetimeValue ? datetimeValue : "";
        time_data_array.push(selectedTime)
        
        //console.log(timeDataList)
    });
    return time_data_array;
}

// =================================================================================================

const making_batchid = (report_date,yeast_num,fer_num) => {

    
    const first_batch = report_date.replace(/[^\d]/g, '').slice(0, 8);
    const second_batch = yeast_num.length === 1 ? '0' + yeast_num : yeast_num;
    const third_batch = fer_num.length === 1 ? '0' + fer_num : fer_num;
    const batch_id = first_batch+second_batch+third_batch

    const batch_obj = {
        'batch_id': batch_id
    }
    return batch_obj
}

const making_id = () => {
    document.querySelectorAll('.msgbox-toggle-on').forEach((element, index) => {
        const id = `cell${index + 1}`;
        element.setAttribute('id', id);
        console.log(id);
    });

    toggle_on_classes.forEach(class_name => {
        document.querySelectorAll(class_name).forEach((element, index) => {
            const id = `${class_name.replace('.', '').replace('-toggle-on','')}-cell${index + 1}`;
            element.setAttribute('id', id);
            console.log(id);
        });
    });
    document.querySelectorAll('.datetime-local').forEach((element, index) => {
        const id = `datetime-input${index + 1}`;
        element.setAttribute('id', id);
        console.log(id);
    });
    document.querySelectorAll('.time-output-box').forEach((element, index) => {
        const id = `datetime-output${index + 1}`;
        element.setAttribute('id', id);
        console.log(id);
    });
    document.querySelectorAll('.select-box').forEach((element, index) => {
        const id = `select-cell${index + 1}`;
        element.setAttribute('id', id);
        console.log(id);
    });

    const checkboxes = document.querySelectorAll('.bool-box input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const { checked, value } = checkbox;
            const boolBox = checkbox.closest('.bool-box');
            if (checked) {
                boolBox.id = value;
            } else {
                boolBox.removeAttribute('id');
            }
        });
    });
};

const select_ingredients = () =>{
    let select_obj = new Map();
    document.querySelectorAll('select[name="ingredinets"]').forEach((element,index) => {
        const value = element.value === "0" ? "": element.value;
        select_obj.set(`main_grain${index+1}`, value);
    });
    return select_obj;
}

const duration_datas = () => {
    const duration_obj = new Map();
    document.querySelectorAll('.duration-time div').forEach((element,index) => {
        let hours = element.querySelector('#hours').value;
        let minutes = element.querySelector('#minutes').value;
        let seconds = String(hours*3600 + minutes*60);
        if(seconds==="0"){
            seconds = ""
        }
        duration_obj.set(durations[index],seconds);
    });
    return duration_obj;
}

const making_time_data = () => {
    let keys = time_culumns;
    let values = extract_time('.datetime-local');
    const time_obj = keys.reduce((acc, key, index) => {
        acc[key] = values[index];
        return acc;
    }, {});
    const valid_fermentation_time = time_obj['valid_fermentation_time'];
    const valid_starttime = new Date(time_obj['valid_starttime']);
    const valid_endtime = new Date(time_obj['valid_endtime']);
    if (valid_starttime && valid_endtime) {
        const difference_seconds = Math.abs(valid_endtime - valid_starttime)/1000;
        console.log(difference_seconds);
        time_obj['valid_elapsed_time'] = String(difference_seconds); // 소요시간
    }
    const report_date = extract_time('.main-timelocal')[0];
    time_obj['report_date'] = report_date;

    console.log(time_obj);
    return time_obj
};


const make_matrix = () => {
    let stack_matrix = new Map();

    stack_times = extract_time('.stack-datetime-local')
    const filtered_stack_times = stack_times.filter(value => value !== '');
    stack_matrix.set('fer_time',`{${filtered_stack_times.join(',')}}`);

    // stack_matrix.set('fer_time',`{${stack_times.join(',')}}`)

    toggle_on_classes.forEach((class_name, index) => {
        const stack_array = Array.from(document.querySelectorAll(class_name), (element, idx) => {
            const id = `${class_name.replace('.', '').replace('-toggle-on', '')}-cell${idx + 1}`;
            element.setAttribute('id', id);
            return extract_text(id);
        });
        
        // stack_matrix.set(stack_culumns[index], `{${stack_array.join(',')}}`);

        const filtered_stack_array = stack_array.filter(value => value !== '');
        stack_matrix.set(stack_culumns[index], `{${filtered_stack_array.join(',')}}`);
    });
    

    return stack_matrix
}

const display_datetime = () => {

    const datetimeInputs = document.querySelectorAll('.datetime-local');
    datetimeInputs.forEach((input,index) => {
        input.addEventListener('change', () => {
            const dateValue = new Date(input.value);
            const month = dateValue.getMonth();
            const day = dateValue.getDate();
            const hours = dateValue.getHours();
            const minutes = dateValue.getMinutes();
            const dateString = `${day} 일 ${hours} 시`;
            const dateString_ = `${month} 월 ${day} 일 ${hours} 시 ${minutes} 분`;
            const outputBox = input.parentElement.querySelector(`#datetime-output${index+1}`);
            outputBox.textContent = index == 1 || index == 3 ? dateString_ : dateString
        
        });
    });


    const startTimeInput = document.querySelector('#datetime-input2');
    const endTimeInput = document.querySelector('#datetime-input4');
    const elapsedTimeCell = document.querySelector('.valid-elapsed-time');

    const update_elapsedtime = () => {
        const startTimeValue = startTimeInput.value;
        const endTimeValue = endTimeInput.value;
    
        if (startTimeValue && endTimeValue) {
            const startTime = new Date(startTimeValue);
            const endTime = new Date(endTimeValue);
    
            const timeDiff = Math.abs(endTime - startTime);
            const hours = Math.floor(timeDiff / (1000 * 60 * 60)); // 시간 계산
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)); // 분 계산
    
            elapsedTimeCell.textContent = `${hours} 시간 ${minutes} 분`;
        } else {
            elapsedTimeCell.textContent = '';
        }
    };
    startTimeInput.addEventListener('input', update_elapsedtime);
    endTimeInput.addEventListener('input', update_elapsedtime);
};

const making_json = async () => {
    try {

        // 각 셀 속성 OBJ call ===========================================================
        const obj = new Map();
        document.querySelectorAll('.msgbox-toggle-on').forEach((element, index) => {
            let content = extract_text(element.id);
            obj.set(set_culumns[index], content);
        });
        let boolBox = document.querySelector('.bool-box');
        let boolBoxId = boolBox.id;
        obj.set("yeast_validation",boolBoxId)

        let time_data = making_time_data()                                  // 소요 시간을 제외한 모든 시간 데이터
        let msg_object = Object.fromEntries(obj);                           // 그냥 데이터 + bool 데이터 포함
        let stack_matrix = Object.fromEntries(make_matrix());               // 리스트 형 데이터
        let select_grains = Object.fromEntries(select_ingredients());       // 주 원료 선택자
        let durations = Object.fromEntries(duration_datas());               // 소요 시간
        let valid_remarks = document.getElementById("remark_cell").innerText // 특이사항

        // Make BatchID =================================================================
        let report_date = time_data['report_date'];
        let yeast_equip_num = msg_object['yeast_equip_num']
        let fer_equip_num = msg_object['fer_equip_num']
        // console.log(time_data,report_date,yeast_equip_num, fer_equip_num) 배치ID 디버깅
        console.log(stack_matrix);
        // Batch ID 유효성 검사 ==========================================================
        if (report_date ==='' || yeast_equip_num ==='' || fer_equip_num ==='') {
            alert('보고 날짜, 공정 번호를 채워주세요')
        }else{
            batch_id = making_batchid(report_date,yeast_equip_num,fer_equip_num)

        }

        // 담당자
        let person = document.getElementById('person-in-charge').value;
        if(person ===""){
            person = "    "
        }
        console.log(person)

        // 각 셀 OBJ 취합 후 JSON stringfy ================================================
        const combi_obj = { ...api_obj, ...batch_id, ...select_grains, ...msg_object, ...stack_matrix, ...time_data, ...durations, "valid_remarks":valid_remarks,"person_in_charge":person};
        // const new_combi_obj = Object.fromEntries(
        //     Object.entries(combi_obj).filter(([_, value]) => value !== "")
        // );
        const new_combi_obj = Object.fromEntries(
            Object.entries(combi_obj).filter(([_, value]) => {
                return value !== "" && value !== "{}";
            })
        );
        if (!new_combi_obj["valid_starttime"] || !new_combi_obj["valid_endtime"]) { // Nan 발생 오류 방지 코드
            delete new_combi_obj["valid_elapsed_time"]
        }
        console.log(new_combi_obj);
        const jsonString = JSON.stringify(new_combi_obj);

        return jsonString;

    } catch (error) {
        console.error('Error making JSON:', error);
        throw error;
    }
}

const sent_data = async (flag) => {
    try {
        const jsonData = await making_json();
        console.log(`제이슨이다 ${jsonData}`); // 디버깅
        const response = await fetch(`http://apst.iptime.org:6662/api/${flag}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: jsonData,
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Resource updated successfully:', data);
    } catch (error) {
        console.error('Error updating resource:', error);
    }
};


// 디버깅 플래그 제작 하기
// 임시 저장 데이터에서 불러오기 기능 추가하기
// 조회 기능 만들기 (+ 페이지를 따로 제작 할건지 ??)




