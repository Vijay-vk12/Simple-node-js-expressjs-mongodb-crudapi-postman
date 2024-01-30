const data = [{ _id: 1, item: "ABC1", sizes: ["S", "M", "L"] }];
const res = data.aggregate([{ $unwind: "$sizes" }]);
console.log("resss", res);

db.principals.aggregate([
  { $match: { role: 2 } },
  {
    $lookup: {
      from: "principals",
      localField: "role",
      foreignField: "role",
      as: "lecture_info",
    },
  },
  { $unwind: "$lecture_info" },
  { $addFields: { "marks.lectureId": "$lecture_info._id" } },
]);
