use dep::std;

// fn main(x: pub [u8; 32], y: pub [u8; 32]) -> pub [u8; 32] {
//     hash_siblings(x, y)
// }

fn main(leaf: [u8; 32], index: u8, level1: [u8; 32], level2: [u8; 32], level3: [u8; 32]) -> pub [u8; 32] {
    verify_merkle_proof(leaf, index, level1, level2, level3)
}

// fn main(x: pub u8) -> pub u8 {
//     get_next_index(x)
// }

// fn main() -> pub [u8; 96] {
//     get_sub_arrays(flat_array)
// } 

fn hash_siblings(left: [u8; 32], right: [u8; 32]) -> [u8; 32] {
    let mut concatenated: [u8; 64] = [0; 64];
    for i in 0..32 {
        concatenated[i] = left[i];
        concatenated[i + 32] = right[i];
    }
    std::hash::sha256(concatenated)
}

fn verify_merkle_proof(leaf: [u8; 32], index: u8, level1: [u8; 32], level2: [u8; 32], level3: [u8; 32]) -> [u8; 32] {
    let mut currentHash = leaf;
    let mut currentIdx = index;
    let is_left = currentIdx % 2 == 0;

    let mut sibling = level1;
    let (left1, right1) = if is_left {
        (currentHash, sibling)
    } else {
        (sibling, currentHash)
    };
    currentHash = hash_siblings(left1, right1);
    currentIdx = get_next_index(currentIdx);

    sibling = level2;
    let (left2, right2) = if is_left {
        (currentHash, sibling)
    } else {
        (sibling, currentHash)
    };
    currentHash = hash_siblings(left2, right2);
    currentIdx = get_next_index(currentIdx);

    sibling = level3;
    let (left3, right3) = if is_left {
        (currentHash, sibling)
    } else {
        (sibling, currentHash)
    };
    currentHash = hash_siblings(left3, right3);
    currentIdx = get_next_index(currentIdx);

    currentHash
}


fn get_next_index(current_idx: u8) -> u8 {
    if (current_idx < 2) {
        0
    } else {
        if current_idx % 2 == 0 {
            current_idx / 2
        } else {
            (current_idx + 1) / 2
        }  
    }
}

// #[test]
// fn test_get_next_index() {
//     constrain get_next_index(0) == 0;
//     constrain get_next_index(1) == 0;
//     constrain get_next_index(2) == 1;
//     constrain get_next_index(3) == 1;
//     constrain get_next_index(4) == 2;
//     constrain get_next_index(5) == 2;
// }

#[test]
fn test_verify_merkle_proof() {
    let leaf = [
        229, 170,  69, 170,  77,  29, 204,
        239,  37, 123, 232, 175, 230, 159,
        97, 135,  60, 188, 229, 219,  71,
        205, 149, 216, 154, 207, 146, 123,
        216,  85, 252, 129
    ];
    let index = 1 as u8;
    let level1 = [
        156,  93, 194, 119, 105, 138,  19,  42,
        72, 179, 242,  59, 210, 121,  51,  59,
        225,  95, 151,  29, 186, 215, 204,   5,
        116, 225,  69, 133, 130, 128, 133, 168
    ];
    let level2 = [
            45, 186,  93, 188,  51, 158, 115, 22,
            174, 162, 104,  63, 175, 131, 156, 27,
            123,  30, 226,  49,  61, 183, 146, 17,
            37, 136,  17, 141, 240, 102, 170, 53
    ];
    let level3 = [
        83,  16, 163,  48, 232, 249, 112,  56,
        133,   3, 199,  51,  73, 216,  11,  69,
        205, 118,  77, 182,  21, 241, 188, 237,
        40,   1, 220, 212,  82,  74,  47, 244
    ];
    let expected_root = [
        251,  29, 164,   2,   5, 110,  80, 216,
        209,  51, 186,  16, 127, 186, 241, 248,
        150, 114,  42, 213, 161,   1, 198, 218,
        227,  72, 204, 245,  71,  23, 220, 207
    ];
    constrain verify_merkle_proof(leaf, index, level1, level2, level3)[0] == expected_root[0];
}

// #[test]
// fn test_get_sub_arrays() {
//     let flat = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95];
//     constrain get_sub_arrays(flat)[0] == 31;
// }

// fn test_concat() {
//     let x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
//     let y = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
//     concat(x, y);
//     // constrain concat(x, y) == 102;
// }