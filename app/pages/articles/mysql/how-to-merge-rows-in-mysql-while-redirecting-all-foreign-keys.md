So let's say you have some rows that are duplicates which you'd like to merge. But there might also be other tables referencing the duplicates. If you build something for merging rows, how can you be sure you don't forget any references, as your app grows?

The best solution is to write a unit test that checks the number of references to the id column and compares this to how many columns are referenced by your code.

Here is an example in Kotlin:
```kotlin
/**
 * Test that all references to topicIds are handled
 * */
@Test
fun testMergeTopics() {
    // Counts the number of references to the Topics.id column
    val resultSet = context().database().connection().prepareStatement("""SELECT COUNT(*)
FROM
information_schema.KEY_COLUMN_USAGE
WHERE
REFERENCED_TABLE_NAME = 'Topics'
AND REFERENCED_COLUMN_NAME = 'id';""").executeQuery()
    val resultSetSize = resultSet.getInt("COUNT(*)")

    // Generate a dummy MergeTopicsQuery to see how many references will be redirected
    val mergeTopics = MergeTopics(1, 2)
    val create = DSL.using(context().database().connection(), MARIADB)
    val updateList = mergeTopics.getUpdateList(create = create)

    // There should be as many updates as there are references to the Topics.id column
    assertEquals(resultSetSize, updateList.size)
}
```

and with `getUpdateList` being

```kotlin
fun getUpdateList(create: DSLContext): List<RowCountQuery> {
    return listOf(
        create.update(TOPICTAGS).set(TOPICTAGS.TOPICID, toKeepId)
            .where(TOPICTAGS.TOPICID.eq(toReplaceId)),
        // ...
    )
}
```

That's more or less the general approach, how exactly you're going to implement it then depends on the language & framework that you're using. I hope I could give you some pointers on how a merging of duplicate rows could be performed safely with MySQL.
