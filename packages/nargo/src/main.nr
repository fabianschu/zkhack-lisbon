use dep::std;

fn main(x: pub [u8; 32]) -> pub [u8; 32] {
    std::hash::sha256(x)
}

#[test]
fn test_main() {
    constrain main([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])[0] == 102;
}

fn test_tmp() {
    constrain tmp([3,4]) == [6, 8];
}