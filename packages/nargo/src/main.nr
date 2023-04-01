use dep::std;

fn append_leafs(a: [u8], b: [u8], start_a: comptime Field, start_b: comptime Field) -> [u8;64] {
    let mut res = [0 as u8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for i in 0..32 {
        res[i] = a[i + start_a];
    }
    for i in 0..32 {
        res[i + 32] = b[i + start_b];
    }
    res
}

fn compute_root_from_leaf_sha256(leaf : [u8;32], index : [u8], hash_path: [u8]) -> [u8;32] {
    let n = index.len();
    let mut current = leaf;
    let mut newLeaf = leaf;
    for i in 0..n {
        if index[i] == 1 {
            newLeaf = dep::std::hash::sha256(append_leafs(hash_path, current, i * 32, 0));
        } else {
            newLeaf = dep::std::hash::sha256(append_leafs(current, hash_path, 0, i * 32));
        }
        current = newLeaf;
    }
    current
}

fn main(root: pub [u8;32], leaf : pub [u8;32], index : [u8;3], hash_path: [u8;96]) -> pub bool {
   root == compute_root_from_leaf_sha256(leaf, index, hash_path)
}