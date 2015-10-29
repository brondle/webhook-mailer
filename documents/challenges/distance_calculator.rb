
def calculate(input)
    inputString = input.to_s
		inputStringArray = inputString.lines.map(&:chomp)
		inputIntArray = []
		attractions = inputStringArray[0].to_i
		timeStrings = inputStringArray[1].split(" ")
		times = []
		queries = inputStringArray[2].to_i
		attractionCount = []
		attractionIndices = []
		timeStrings.each do |time|
			times.push(time.to_i)
		end
		3.times do
			inputStringArray.delete_at(0)
		end
		counter = 0
		inputStringArray.each do |x|
			if (counter%2 == 0)
				y = x.to_i
				attractionCount.push(x)
			else
				y = x.split(" ")
				y.each do |num|
					y = num.to_i
				    attractionIndices.push(num)
				end
			end
			counter+= 1
		end
		indicesInts = transformIndices(attractionCount, attractionIndices)

		output = quickestPath(indicesInts, times)
		output.each do |time|
			puts time
		end
end

def transformIndices(array1, array2)
	counter = 0
	stringArray =[]
	returnArray = []
	array1.each do |count|
		x = array2[0..(array1[counter].to_i - 1)]
		x.join(" ")
		stringArray.push(x)
		array2.slice!(0..array1[counter].to_i - 1)
		counter += 1
	end
	stringArray.each do |array|
		arrayX = []
		array.each do |num|
			arrayX.push(num.to_i)
		end
		returnArray.push(arrayX)
	end
	return returnArray

end

def quickestPath(indexArray, timeArray)
	outputArray = []
	indexArray.each do |sub_array|
		countForward = 0
		countBack = 0
		start = sub_array[0]
		count = speedTest(sub_array, timeArray)
		outputArray.push(count)
	end
	return outputArray
end


def speedTest(indexArray, timeArray)
	return_count = 0
	loop_count = indexArray.length - 1
	for x in 0..loop_count
		if x < loop_count
			starting_point = indexArray[x]
			ending_point = indexArray[x + 1]
			forward_time = 0
			backward_time = 0

			#forward check
			if starting_point < ending_point
				for x in (starting_point)..(ending_point - 1)
					forward_time += timeArray[x]
				end
			else
				counter = starting_point
				while counter != ending_point
					forward_time += timeArray[counter]
					if counter < (timeArray.length - 1)
						counter += 1
					else
						counter = 0
					end
				end
			end

				# backward check
			counter2 = (starting_point)

			while (counter2 != ending_point )
				counter2 -= 1
				if timeArray[counter2] != 0
					backward_time += timeArray[counter2]
				end
				if counter2 < 0
					counter2 = timeArray.length - 1
				end
			end
			if forward_time > backward_time
				return_count += backward_time
			else
				return_count += forward_time
			end
		end
	end
	return return_count
end

inp = $stdin.read
calculate(inp)
