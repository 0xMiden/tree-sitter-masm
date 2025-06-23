import XCTest
import SwiftTreeSitter
import TreeSitterMasm

final class TreeSitterMasmTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_masm())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Miden Assembly grammar")
    }
}
