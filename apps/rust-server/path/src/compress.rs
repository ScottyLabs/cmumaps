/* compress.rs
    Compress the graph for search and then blow up a path into its full form.
    This is used to reduce the size of the graph for search and then expand it
    back to its full form for display.

    The compressed graph simply condenses any path that must be taken together into a single node, 
    so a-b-c-d-e would become a-e, with the cost of the path being the sum of the costs of the edges.
    The compression function returns a new graph with the compressed nodes and edges and a mapping of
    the compressed nodes the full segment.  The one catch is that the start or end nodes of the path
    might be in a compressed node, so we will also need a mapping of nodes -> compressed nodes as well.

    The decompression function takes a compressed graph and a path and returns the full path.
    It uses the mapping of compressed nodes to their full paths to expand the path back to its full form.
    The decompressed path is then returned as a vector of nodes.
*/

fn compress(graph: Graph) -> CGraph{
    // init new_graph, cluster_to_nodes, node_to_cluster
    

    for (node_id, node_data) in graph.iter(){
        // if node has two neighbors, cluster it

    }
}