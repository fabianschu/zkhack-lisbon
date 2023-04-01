use dep::std;

fn main(x: pub [u8; 32]) -> pub [u8; 32] {
    std::hash::sha256(x)
}

fn tmp(x: [u8; 2]) -> pub [u8; 2] {
    [x[0] * 2, x[1] * 2]
}

// fn add(x: u64, y: u64) -> u64 {
//   x + y
// }

// #[test]
// fn test_add() {
//   constrain add(2,2) == 4;
//   constrain add(0,1) == 1;
//   constrain add(1,0) == 1;
// }

#[test]
fn test_main() {
    constrain main([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])[0] == 102;
}

fn test_tmp() {
    constrain tmp([3,4]) == [6, 8];
}