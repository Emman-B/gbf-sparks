// ===================================================================
// DOM Code - code that modifies the DOM
// ===================================================================

// function that runs when the window loads
window.onload = () => {
};

// function that runs to do the calculation, called by the calculate button
function do_calculation() {
    // get the HTML elements that correspond to the inputs
    const crystalsInput = document.getElementById("crystals-input");
    const tenDrawsInput = document.getElementById("ten-draws-input");
    const singleDrawsInput = document.getElementById("single-draws-input");

    // do the calculation and store it into an object
    const results = calculate_sparks(crystalsInput.value, tenDrawsInput.value, singleDrawsInput.value);

    // update the output elements
    document.getElementById("roll-count-output").textContent = results.total_draws;
    document.getElementById("spark-count-output").textContent = results.total_sparks;
    document.getElementById("needed-rolls-output").textContent = results.draws_to_next_spark;
    document.getElementById("needed-crystals-output").textContent = results.crystals_for_next_spark;
    document.getElementById("needed-ten-draws-output").textContent = results.ten_draws_for_next_spark;
}


// ===================================================================
// Logic Functions - any of the extra calculation functions go here
// ===================================================================

/**
 * Calculates how many sparks user has, returning an object with all the results needed
 * @param {string} crystals_str number of crystals as a string
 * @param {string} ten_draw_tickets_str number of ten-draw tickets as a string
 * @param {string} single_draw_tickets_str number of single-draw tickets as a string
 * @returns object with all of the results
 */
 function calculate_sparks (crystals_str = '0', ten_draw_tickets_str = '0', single_draw_tickets_str = '0') {
    // number of rolls needed to spark
    const SPARK_VAL = 300;

    // number of crystals needed to roll
    const CRYSTAL_ROLL_COST = 300;

    // calculate how many rolls with the above params (do conversion first, then calculation)
    const [crystals, ten_draw_tickets, single_draw_tickets] = convert_materials_to_numbers(crystals_str, ten_draw_tickets_str, single_draw_tickets_str);
    const total_draws = calculate_rolls(crystals, ten_draw_tickets, single_draw_tickets);

    // calculate how many full sparks can be done
    const total_sparks = Math.floor(total_draws / SPARK_VAL);

    // calculate how many draws are needed until the next spark
    const draws_to_next_spark = SPARK_VAL - (total_draws % SPARK_VAL);

    // calculate how many crystals are needed for the next spark
    /** explanation of calculation:
     *  - first part is to take how many draws until the next spark and multiply it by how many crystals it costs per draw
     *      - 1 less draw is considered in this calculation for the second part
     *  - second part is to find out how many crystals you need to roll one more time (e.g., 170 crystals -> 130 crystals for next draw)
     *  - then sum both parts together
     */
    const crystals_for_next_spark = ((draws_to_next_spark * CRYSTAL_ROLL_COST) - 300) + (300 - (crystals % CRYSTAL_ROLL_COST));

    // create object that has the results of the calculations and return it
    const results = {
        // totals
        total_draws: total_draws,
        total_sparks: total_sparks,
        // draws and materials needed for the next spark
        draws_to_next_spark: draws_to_next_spark,
        crystals_for_next_spark: crystals_for_next_spark,
        ten_draws_for_next_spark: Math.ceil(draws_to_next_spark / 10),
    };
    return results;
}



/**
 * Calculates how many rolls user has, depending on the materials owned
 * @param {number} crystals number of crystals
 * @param {number} ten_draw_tickets number of ten-draw tix
 * @param {number} single_draw_tickets number of single-draw tix
 * @returns total number of rolls
 */
 function calculate_rolls (crystals = 0, ten_draw_tickets = 0, single_draw_tickets = 0) {
    // number of crystals needed to roll
    const CRYSTAL_ROLL_COST = 300;

    // calculating how many draws for the crystals and ten-draw tix
    const crystal_draws = Math.floor(crystals / CRYSTAL_ROLL_COST);
    const ten_draws = ten_draw_tickets * 10; 
    const total_draws = crystal_draws + ten_draws + single_draw_tickets; // total number of draws

    // returns how many draws
    return total_draws;
}

/**
 * Converts a material string into a number, or 0 if any errors occurred
 * @param {string} material_str number of a material as a string
 * @returns number of material as a number, or 0 if any errors occurred
 */
function convert_material_to_number (material_str) {
    // default value if material_str is invalid or negative
    const minimum_default_value = 0;

    // check if material_str is valid
    if (material_str) {
        // convert material_str into a number and store it into a variable
        const possible_result = parseInt(material_str);

        // do not return the possible result if it is smaller than the default
        if (possible_result >= minimum_default_value) {
            return possible_result;
        }
    }

    // this is reached if material_str is invalid or the conversion is less than the minimum
    return minimum_default_value;
}

/**
 * Converts the materials used in a spark (which are strings) into an array of numbers  
 * @param {string} crystals_str number of crystals as a string
 * @param {string} ten_draw_tickets_str number of ten-draw tickets as a string
 * @param {string} single_draw_tickets_str number of single-draw tickets as a string
 * @returns array of results in the following order: number of crystals, number of ten-draw tix, number of single-draw tix
 */
function convert_materials_to_numbers (crystals_str = '', ten_draw_tickets_str = '', single_draw_tickets_str = '') {
    // convert the material strings into numbers
    const crystals = convert_material_to_number(crystals_str);
    const ten_draw_tickets = convert_material_to_number(ten_draw_tickets_str);
    const single_draw_tickets = convert_material_to_number(single_draw_tickets_str);

    // return the above results as an array
    return [crystals, ten_draw_tickets, single_draw_tickets];
}
